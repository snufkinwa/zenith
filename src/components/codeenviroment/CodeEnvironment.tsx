import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ThemedCodingPanel from "./right-section/ThemedCodingPanel";
import ProblemList from "./left-section/question/ProblemList";
import ProblemDisplay from "./left-section/question/ProblemDisplay";
import { getCustomProblems, type CustomProblem } from "@/utils/customProblems";
import BottomModal from "./BottomModal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, BookOpen, ChevronUp } from "lucide-react";
import { cleanInput, buildPythonScript, extractFunctionName, cleanDisplayText } from '@/utils/codeBuilder';
import { ThemeProvider } from "./right-section/ThemeContext";


interface Company {
  name: string;
  slug: string;
  frequency: number;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  companies?: Company[];
  note?: string | null;
  follow_up?: string;
  isCustom?: boolean; 
  source?: string;   
  createdAt?: string; 
}

interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTime?: number;
  error?: string;
}

interface CodeEnvironmentProps {
  problems: Problem[];
}

const CodeEnvironment: React.FC<CodeEnvironmentProps> = ({ problems:defaultProblems }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [customProblems, setCustomProblems]=useState<Problem[]>([])
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);

  const allProblems = useMemo(() => {
    return [...defaultProblems, ...customProblems];
  }, [defaultProblems, customProblems]);

   useEffect(() => {
    const loadCustomProblems = () => {
      try {
        const custom = getCustomProblems();
        // Convert custom problems to match Problem interface
        const converted = custom.map(cp => ({
          ...cp,
          companies: cp.companies || []
        }));
        setCustomProblems(converted);
      } catch (error) {
        console.error('Error loading custom problems:', error);
      }
    };

    loadCustomProblems();
  }, []);

  // Handle new problem creation
  const handleProblemCreated = (newProblem: Problem) => {
    setCustomProblems(prev => [...prev, newProblem]);
    
    // Automatically select the new problem
    setSelectedProblem(newProblem);
    
    // Update URL to reflect the new problem
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('problem', newProblem.slug);
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    
    // Clear editor state for new problem
    setInput('');
    setOutput('');
    setConsoleOutput('');
    setErrors('');
    setTestResults([]);
  };

 useEffect(() => {
    const problemSlug = searchParams.get('problem');

    if (problemSlug && allProblems.length > 0) {
      const matchedProblem = allProblems.find(p => p.slug === problemSlug);
      if (matchedProblem) {
        setSelectedProblem(matchedProblem);
      }
    } else if (allProblems.length > 0 && !problemSlug) {
      // Only set first problem if no URL param at all
      const firstProblem = allProblems[0];
      setSelectedProblem(firstProblem);
      
      // Update URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('problem', firstProblem.slug);
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, allProblems, router]); // Use allProblems instead of problems

  // Helper to make API requests
  const makeApiRequest = async (data: { language: string; version: string; files: { content: string; }[] | { content: string; }[]; }) => {
    const res = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  };

  // Helper to update console output
  const updateConsole = (setter: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: (prev: any) => string): void; }, message: string, append = true) => {
    if (append) {
      setter((prev) => `${prev}\n${message}`);
    } else {
      setter(message);
    }
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setConsoleOutput("");
    setErrors("");

    const requestData = {
      language: "python",
      version: "3.10.0",
      files: [{ content: input }],
    };

    try {
      const result = await makeApiRequest(requestData);

      if (result?.run?.output) {
        setOutput(result.run.output);
        setConsoleOutput(
          `Code executed successfully at ${new Date().toLocaleTimeString()}\nLanguage: Python\n${result.run.output}`
        );
        setErrors(""); // Clear errors on successful run
      } else {
        setOutput("No output returned.");
        setConsoleOutput("No output returned.");
        setErrors(""); // Clear errors if no output but no explicit error
      }

      let hasError = false;
      if (result?.compile?.stderr) {
        updateConsole(setConsoleOutput, `Compilation Error:\n${result.compile.stderr}`);
        setErrors(result.compile.stderr);
        hasError = true;
      }
      if (result?.run?.stderr) {
        updateConsole(setConsoleOutput, `Runtime Error:\n${result.run.stderr}`);
        setErrors(result.run.stderr);
        hasError = true;
      }

      if (!hasError && !result?.run?.output) {
          // This case handles when there's no output and no explicit error, still an issue.
          const msg = "Execution completed, but no output or error was returned.";
          setOutput(msg);
          setConsoleOutput(msg);
          setErrors(msg);
      }

    } catch (error) {
      const errorMessage = `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setOutput(errorMessage);
      setConsoleOutput(errorMessage);
      setErrors(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async (
    customTestCases: Array<{ input: string; expected?: string; isCustom?: boolean }> = []
  ) => {
    if (!selectedProblem || !input.trim()) {
      const errorMsg = "Please write some code and select a problem before running tests.";
      setErrors(errorMsg);
      setConsoleOutput(errorMsg);
      return;
    }

    setTestLoading(true);
    setTestResults([]);
    updateConsole(setConsoleOutput, "Running test cases...\n", false);
    setErrors("");

    const baseCases = selectedProblem.examples.map((ex, idx) => ({
      id: idx + 1,
      input: ex.input,
      expected: ex.output,
      isCustom: false,
    }));

    const customCases = customTestCases.filter((tc) => tc.isCustom && tc.input.trim());

    const allTestCases = [...baseCases, ...customCases];
    if (allTestCases.length === 0) {
      updateConsole(setConsoleOutput, "No test cases available for this problem.");
      return;
    }

    const functionName = extractFunctionName(input);
    const results: TestResult[] = [];

    for (let i = 0; i < allTestCases.length; i++) {
      const testCase = allTestCases[i];
      updateConsole(setConsoleOutput, `Running Test Case ${i + 1}...`);

      const cleaned = cleanInput(testCase.input);
      const script = buildPythonScript(input, cleaned);

      const testResult: TestResult = {
      testCase: i + 1,
      input: cleanDisplayText(testCase.input),    
      expected: cleanDisplayText(testCase.expected || ""), 
      actual: "",
      passed: false,
      executionTime: 0,
      };

    try {
        const startTime = Date.now();
        const response = await makeApiRequest({
          language: "python",
          version: "3.10.0",
          files: [{ content: script }],
        });

        testResult.executionTime = Date.now() - startTime;

        const output = response?.run?.output?.trim();
        const error = response?.run?.stderr || response?.compile?.stderr;

        if (output) {
          testResult.actual = output;
          const cleanActual = output.replace(/\s+/g, "");
          const cleanExpected = cleanDisplayText(testCase.expected || "").replace(/\s+/g, "");
          testResult.passed = cleanActual === cleanExpected;
        } else {
          testResult.actual = "Error occurred";
          testResult.error = error || "No output returned";
        }
      } catch (err) {
        testResult.actual = "Execution failed";
        testResult.error = err instanceof Error ? err.message : "Unknown error";
      }

      // Add to results
      results.push(testResult);
      
      const status = testResult.passed ? "✅ PASSED" : "❌ FAILED";
      const execTime = testResult.executionTime ?? 0;
      updateConsole(setConsoleOutput, `Test Case ${i + 1}: ${status} (${execTime}ms)`);
    }

        setTestResults(results);
        setTestLoading(false);
      };

 

  const handleSelectProblem = (problem: Problem) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('problem', problem.slug);
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    
    // Clear editor/terminal state
    setInput('');
    setOutput('');
    setConsoleOutput('');
    setErrors('');
    setTestResults([]);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Problem Section (Collapsible) */}
        {!isProblemPanelCollapsed && (
          <>
            <Panel minSize={25} defaultSize={50} maxSize={70}>
              <div className="h-full flex flex-col bg-white relative">
                {/* Collapse Button */}
                <button
                  onClick={() => setIsProblemPanelCollapsed(true)}
                  className="absolute top-4 right-4 z-10 p-2 bg-gray-100 text-black hover:bg-gray-200 rounded-md transition-colors"
                  title="Hide problem panel - Focus on coding"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Problem Section */}
                <div className="flex-1 overflow-auto">
                  <div className="p-6 pr-16"> {/* Extra right padding for button */}
                    <div className="mb-6">
                      <ProblemDisplay 
                        problem={selectedProblem}
                        className=""
                      />
                    </div>

                    {/* Problem List Component */}
                    <div className="mt-8 border-t pt-6">
                      <ProblemList
                        problems={allProblems}
                        selectedProblem={selectedProblem}
                        onSelectProblem={handleSelectProblem}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            
            <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 cursor-col-resize" />
          </>
        )}
        
        {/* Show Problem Button (when collapsed) */}
        {isProblemPanelCollapsed && (
          <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-start pt-4">
            <button
              onClick={() => setIsProblemPanelCollapsed(false)}
              className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors mb-4"
              title="Show problem panel"
            >
              <BookOpen size={16} />
            </button>
          </div>
        )}

        <Panel minSize={30} defaultSize={50}>
          <ThemeProvider>
            <ThemedCodingPanel
              input={input}
              setInput={setInput}
              selectedProblem={selectedProblem}
              output={output}
              consoleOutput={consoleOutput}
              errors={errors}
              runCode={runCode}
              runTests={runTests}
              loading={loading}
              testLoading={testLoading}
              testResults={testResults}
              isTerminalCollapsed={isTerminalCollapsed}
              setIsTerminalCollapsed={setIsTerminalCollapsed}
            />
          </ThemeProvider>
        </Panel>
      </PanelGroup>

      {/* Bottom Modal Component */}
      <BottomModal 
      selectedProblem={selectedProblem}
      onProblemCreated={handleProblemCreated}
      />
    </div>
  );
};

export default CodeEnvironment;