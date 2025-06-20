import React from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Editor from './Editor';
import Terminal from './Terminal';

const ThemedCodingPanel: React.FC<{
  input: string;
  setInput: (input: string) => void;
  selectedProblem: any;
  output: string;
  consoleOutput: string;
  errors: string;
  runCode: () => Promise<void>;
  runTests: (customTestCases?: any[]) => Promise<void>;
  loading: boolean;
  testLoading: boolean;
  testResults: any[];
  isTerminalCollapsed: boolean;
  setIsTerminalCollapsed: (collapsed: boolean) => void;
}> = ({
  input,
  setInput,
  selectedProblem,
  output,
  consoleOutput,
  errors,
  runCode,
  runTests,
  loading,
  testLoading,
  testResults,
  isTerminalCollapsed,
  setIsTerminalCollapsed,
}) => {
  // Now we can use the theme context since we're inside ThemeProvider
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className="h-full flex flex-col">
      {/* Top Section - Code Editor */}
      <div className={`${isTerminalCollapsed ? 'h-full' : 'flex-1'} flex flex-col`}>
        <Editor
          input={input}
          setInput={setInput}
          problemSlug={selectedProblem?.slug}
        />
      </div>
      
      {/* Terminal Section - Collapsible */}
      {!isTerminalCollapsed && (
        <div className={`h-96 flex flex-col ${themeClasses.borderColor} border-t`}>
          <Terminal
            output={output}
            consoleOutput={consoleOutput}
            errors={errors}
            runCode={runCode}
            runTestCases={runTests}
            loading={loading}
            testLoading={testLoading}
            testResults={testResults}
            isCollapsed={isTerminalCollapsed}
            onToggleCollapse={() => setIsTerminalCollapsed(true)}
            selectedProblem={selectedProblem}
          />
        </div>
      )}
      
      {/* Collapsed Terminal Button - Now Themed */}
      {isTerminalCollapsed && (
        <div className={`h-10 border-t ${themeClasses.borderColor} flex items-center justify-between px-4 ${themeClasses.terminalHeaderBg}`}>
          <span className={`text-sm ${themeClasses.terminalHeaderText}`}>Terminal</span>
          <button
            onClick={() => setIsTerminalCollapsed(false)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${themeClasses.terminalTabInactive}`}
          >
            <ChevronUp className="w-4 h-4" />
            Show
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemedCodingPanel;