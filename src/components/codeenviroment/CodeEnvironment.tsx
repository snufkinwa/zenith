import React, { useState, useEffect } from "react";
import Editor from "./right-section/Editor";
import Terminal from "./terminal";
import ProblemList from "./left-section/question/ProblemList";
import ProblemDisplay from "./left-section/question/ProblemDisplay";
import BottomModal from "./BottomModal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight, Code, BookOpen } from "lucide-react";

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

interface CompileResult {
  run?: {
    output?: string;
    stderr?: string;
  };
  compile?: {
    output?: string;
    stderr?: string;
  };
}

const languageOptions: { [key: string]: LanguageOption } = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  javascript: { language: "javascript", version: "18.15.0" },
};

const CodeEnvironment: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string>("");
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);

  // Separate function for running code (from editor)
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

      const result: CompileResult = await res.json();
      
      // Handle successful execution
      if (result?.run?.output) {
        setOutput(result.run.output);
        setConsoleOutput(`Code executed successfully at ${new Date().toLocaleTimeString()}\nLanguage: ${language}\n${result.run.output}`);
      } else {
        setOutput("No output returned.");
        setConsoleOutput(`Code executed at ${new Date().toLocaleTimeString()}\nLanguage: ${language}\nNo output returned.`);
      }

      // Handle compilation errors
      if (result?.compile && typeof result.compile.stderr === "string") {
        setErrors(`Compilation Error:\n${result.compile.stderr}`);
        setConsoleOutput(prev => `${prev}\n\nCompilation Error:\n${result.compile?.stderr}`);
      }

      // Handle runtime errors
      if (result?.run && typeof result.run.stderr === "string") {
        setErrors(prev => `${prev}\nRuntime Error:\n${result.run && result.run.stderr ? result.run.stderr : ''}`);
        setConsoleOutput(prev => `${prev}\n\nRuntime Error:\n${result.run && result.run.stderr ? result.run.stderr : ''}`);
      }

    } catch (error) {
      const errorMessage = `Network/API Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setErrors(errorMessage);
      setConsoleOutput(`Error at ${new Date().toLocaleTimeString()}\n${errorMessage}`);
      setOutput("Failed to execute code. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Separate function for running test cases
  const runTestCases = async () => {
    setTestLoading(true);
    setConsoleOutput(prev => `${prev}\n\n--- Running Test Cases at ${new Date().toLocaleTimeString()} ---`);
    
    try {
      // This would typically run against predefined test cases
      // For now, we'll simulate test case execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testResults = `Test Case 1: PASSED ✓
Input: [2,7,11,15], target = 9
Expected: [0,1]
Output: [0,1]
Time: 0.001s

Test Case 2: PASSED ✓
Input: [3,2,4], target = 6
Expected: [1,2]
Output: [1,2]
Time: 0.001s

Test Case 3: FAILED ✗
Input: [3,3], target = 6
Expected: [0,1]
Output: [1,0]
Time: 0.002s

Summary: 2/3 test cases passed`;

      setConsoleOutput(prev => `${prev}\n${testResults}`);
      setOutput(testResults);
      
    } catch (error) {
      const errorMessage = `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setErrors(prev => `${prev}\n${errorMessage}`);
      setConsoleOutput(prev => `${prev}\n${errorMessage}`);
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
            
            <div className="writing-mode-vertical text-xs text-gray-500 transform rotate-90 mt-8">
              Problem
            </div>
          </div>
        )}
        
        {/* Right Panel - Code & Terminal */}
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
                runTestCases={runTestCases}
                loading={loading}
                testLoading={testLoading}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
      
      {/* Bottom Modal Component - Outside PanelGroup */}
      <BottomModal />
    </div>
  );
};

export default CodeEnvironment;