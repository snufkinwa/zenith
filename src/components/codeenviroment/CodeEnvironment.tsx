import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Editor from "./right-section/Editor";
import Terminal from "./terminal";
import ProblemList from "./left-section/question/ProblemList";
import ProblemDisplay from "./left-section/question/ProblemDisplay";
import BottomModal from "./BottomModal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, BookOpen } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string | null;
  content: string;
}

interface LanguageOption {
  language: string;
  version: string;
}

const languageOptions: { [key: string]: LanguageOption } = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  javascript: { language: "javascript", version: "18.15.0" },
};

const CodeEnvironment: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);

  // Handle URL parameter for problem selection
  useEffect(() => {
    const problemId = searchParams.get('problem');
    
    if (problemId && problems.length > 0) {
      // Find problem by ID
      const problemFromUrl = problems.find(p => p.id === problemId);
      if (problemFromUrl) {
        setSelectedProblem(problemFromUrl);
        return;
      }
    }
    
    // Fallback: select first problem if none selected and no URL param
    if (!selectedProblem && problems.length > 0) {
      const firstProblem = problems[0];
      setSelectedProblem(firstProblem);
      // Update URL to reflect the selected problem
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('problem', firstProblem.id);
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, problems, selectedProblem, router]);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setConsoleOutput("");
    setErrors("");

    const languageOption = languageOptions[language];
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: input,
        },
      ],
    };

    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      if (result?.run?.output) {
        setOutput(result.run.output);
        setConsoleOutput(`Code executed successfully at ${new Date().toLocaleTimeString()}\nLanguage: ${language}\n${result.run.output}`);
        setErrors("");
      } else {
        setOutput("No output returned.");
        setConsoleOutput("No output returned.");
        setErrors("");
      }

      // Handle compilation errors
      if (result?.compile?.stderr) {
        setErrors(result.compile.stderr);
        setConsoleOutput(prev => `${prev}\n\nCompilation Error:\n${result.compile.stderr}`);
      }

      // Handle runtime errors
      if (result?.run?.stderr) {
        setErrors(result.run.stderr);
        setConsoleOutput(prev => `${prev}\n\nRuntime Error:\n${result.run.stderr}`);
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

  const runTests = async () => {
    setTestLoading(true);
    try {
      // Mock test implementation - replace with actual test logic
      const testResults = "Test 1: PASSED\nTest 2: PASSED\nTest 3: FAILED - Expected 5, got 4\nOverall: 2/3 tests passed";
      
      setConsoleOutput(testResults);
      setOutput(testResults);
      setErrors("");
    } catch (error) {
      const errorMessage = `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setErrors(errorMessage);
      setConsoleOutput(errorMessage);
    } finally {
      setTestLoading(false);
    }
  };

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setInput("");
    setOutput("");
    setConsoleOutput("");
    setErrors("");
    
    // Update URL to reflect the selected problem
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('problem', problem.id);
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
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
                  className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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
                        problems={problems}
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
              <BookOpen size={18} />
            </button>
            
            <div className="transform rotate-90 text-xs text-gray-500 whitespace-nowrap origin-center mt-8">
              Problems
            </div>
          </div>
        )}

        {/* Right Panel - Code Editor and Terminal */}
        <Panel minSize={30}>
          <div className="h-full flex flex-col bg-gray-50 relative">
            {/* Editor Section - Fixed 60% height */}
            <div className="h-3/5 bg-white border-l border-gray-200">
              <Editor 
                input={input} 
                setInput={setInput} 
                setLanguage={setLanguage}
                runCode={runCode}
                loading={loading}
              />
            </div>
            
            {/* Simple Divider */}
            <div className="h-0.5 bg-gray-300"></div>
            
            {/* Terminal Section - Fixed 40% height */}
            <div className="h-2/5 bg-white border-l border-gray-200">
              <Terminal 
                output={output}
                consoleOutput={consoleOutput}
                errors={errors}
                runCode={runCode}
                runTestCases={runTests}
                loading={loading}
                testLoading={testLoading}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
      <BottomModal />
    </div>
  );
};

export default CodeEnvironment;