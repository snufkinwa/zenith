import React, { useState } from 'react';
import { Play, Terminal as TerminalIcon, AlertCircle, CheckCircle, Clock, Bug, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';


interface TestCase {
  id: number;
  input: string;
  expected?: string;
  isCustom?: boolean;
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

interface TerminalProps {
  output: string;
  consoleOutput: string;
  errors: string;
  runCode: () => Promise<void>;
  runTestCases: (customTestCases?: TestCase[]) => Promise<void>;
  loading: boolean;
  testLoading: boolean;
  testResults?: TestResult[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  selectedProblem?: {
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
    note?: string | null;
    follow_up?: string;
  } | null;
}

interface ConsoleMessage {
  type: 'info' | 'error' | 'success' | 'warning';
  message: string;
  timestamp: string;
}

const Terminal: React.FC<TerminalProps> = ({ 
  output, 
  consoleOutput,
  errors,
  runCode, 
  runTestCases,
  loading,
  testLoading,
  testResults = [],
  onToggleCollapse,
  selectedProblem
}) => {
  const [activeTab, setActiveTab] = useState<string>("testcases");
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<number>(1);

  function sanitizeForTerminal(raw: string): string {
    return raw
      .replace(/^.*?=\s*/, '')              // remove labels like "height ="
      .replace(/\\([[\]{}()])/g, '$1')      // unescape backslashed brackets
      .replace(/[\[\]{}]/g, match => match) // optionally keep or remove [] {} ()
      .replace(/\\n/g, '\n')                // handle \n literals
      .replace(/\\t/g, '\t')                // handle \t literals
      .replace(/\s+/g, ' ')                 // compress extra whitespace
      .trim();
  }

  // Generate test cases from problem data + custom cases
  const allTestCases = React.useMemo(() => {
    const problemTestCases: TestCase[] = selectedProblem?.examples?.map((example, index) => ({
      id: index + 1,
      input: sanitizeForTerminal(example.input),
      expected: sanitizeForTerminal(example.output),
      isCustom: false
    })) || [];

    return [...problemTestCases, ...customTestCases];
  }, [selectedProblem?.examples, customTestCases]);

  // Reset selected test case when problem changes
  React.useEffect(() => {
    if (allTestCases.length > 0 && !allTestCases.find(tc => tc.id === selectedTestCase)) {
      setSelectedTestCase(allTestCases[0].id);
    }
  }, [allTestCases, selectedTestCase]);

  const addCustomTestCase = () => {
    const newId = Math.max(...allTestCases.map(tc => tc.id), 0) + 1;
    const newCustomCase = { 
      id: newId, 
      input: '', 
      expected: '', 
      isCustom: true 
    };
    setCustomTestCases([...customTestCases, newCustomCase]);
    setSelectedTestCase(newId);
  };

  const removeTestCase = (id: number) => {
    const updatedCustomCases = customTestCases.filter(tc => tc.id !== id);
    setCustomTestCases(updatedCustomCases);
    if (selectedTestCase === id && allTestCases.length > 1) {
      const remainingCases = allTestCases.filter(tc => tc.id !== id);
      setSelectedTestCase(remainingCases[0]?.id || 1);
    }
  };

  const updateTestCase = (id: number, field: 'input' | 'expected', value: string) => {
    setCustomTestCases(customTestCases.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const handleRunTests = () => {
    runTestCases(allTestCases);
  };

  const selectedTest = allTestCases.find(tc => tc.id === selectedTestCase);
  
  // Parse console messages
  const parseConsoleMessages = (consoleText: string, errorText: string): ConsoleMessage[] => {
    const messages: ConsoleMessage[] = [];
    const timestamp = new Date().toLocaleTimeString();

    if (consoleText) {
      consoleText.split('\n').forEach(line => {
        if (line.trim()) {
          messages.push({
            type: 'info',
            message: line,
            timestamp
          });
        }
      });
    }

    if (errorText) {
      errorText.split('\n').forEach(line => {
        if (line.trim()) {
          messages.push({
            type: 'error',
            message: line,
            timestamp
          });
        }
      });
    }

    return messages;
  };

  const consoleMessages = parseConsoleMessages(consoleOutput, errors);

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <TerminalIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-t border-gray-200">
      {/* Header with Collapse Button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 min-h-[48px]">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab("testcases")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "testcases" 
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Test Cases
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "results" 
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Test Results
            {testResults.length > 0 && (
              <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-4 flex items-center justify-center ${
                testResults.every(r => r.passed) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {testResults.filter(r => r.passed).length}/{testResults.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "output" 
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab("console")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "console" 
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Console
            {consoleMessages.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-4 flex items-center justify-center">
                {consoleMessages.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Run Buttons */}
          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors text-sm"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Run
              </>
            )}
          </button>

          <button
            onClick={handleRunTests}
            disabled={testLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors text-sm"
          >
            {testLoading ? (
              <>
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Testing
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3" />
                Test
              </>
            )}
          </button>

          {/* Collapse Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              title="Collapse terminal"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "testcases" && (
          <div className="h-full flex">
            {/* Test Case Tabs */}
            <div className="w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <div className="p-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Cases</span>
                  <button
                    onClick={addCustomTestCase}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                    title="Add custom test case"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {allTestCases.map((testCase, index) => {
                  // Calculate display index for problem test cases
                  const displayIndex = testCase.isCustom ? 'Custom' : `Case ${index + 1}`;
                  
                  return (
                    <div
                      key={testCase.id}
                      className={`p-2 mb-1 rounded cursor-pointer transition-colors ${
                        selectedTestCase === testCase.id
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedTestCase(testCase.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {displayIndex}
                        </span>
                        {testCase.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTestCase(testCase.id);
                            }}
                            className="p-0.5 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Case Details */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedTest && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Input:
                    </label>
                    {selectedTest.isCustom ? (
                      <textarea
                        value={selectedTest.input}
                        onChange={(e) => updateTestCase(selectedTest.id, 'input', e.target.value)}
                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter your input..."
                      />
                    ) : (
                      <div className="bg-gray-100 p-3 rounded-md border">
                        <code className="text-sm">{selectedTest.input}</code>
                      </div>
                    )}
                  </div>

                  {selectedTest.expected && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Output:
                      </label>
                      {selectedTest.isCustom ? (
                        <textarea
                          value={selectedTest.expected}
                          onChange={(e) => updateTestCase(selectedTest.id, 'expected', e.target.value)}
                          className="w-full h-16 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Enter expected output..."
                        />
                      ) : (
                        <div className="bg-gray-100 p-3 rounded-md border">
                          <code className="text-sm">{selectedTest.expected}</code>
                        </div>
                      )}
                    </div>
                  )}

              
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="h-full overflow-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Test Results</h3>
              {testResults.length > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testResults.every(r => r.passed) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                </span>
              )}
            </div>

            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No test results yet.</p>
                <p className="text-sm">Run tests to see detailed results here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      result.passed
                        ? 'bg-green-50 border-green-400'
                        : 'bg-red-50 border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          Test Case {result.testCase}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.passed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      {result.executionTime && (
                        <span className="text-xs text-gray-500">
                          {result.executionTime < 1000 
                            ? `${result.executionTime}ms` 
                            : `${(result.executionTime/1000).toFixed(2)}s`
                          }
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Input:</span>
                        <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                          {result.input}
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Expected:</span>
                        <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                          {result.expected}
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Actual:</span>
                        <div className={`p-2 rounded mt-1 font-mono text-xs ${
                          result.passed ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {result.actual}
                        </div>
                      </div>

                      {result.error && (
                        <div>
                          <span className="font-medium text-red-700">Error:</span>
                          <div className="bg-red-100 p-2 rounded mt-1 font-mono text-xs text-red-800">
                            {result.error}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "output" && (
          <div className="h-full overflow-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <TerminalIcon className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Program Output</h3>
            </div>
            
            <div className="bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-4 h-full overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {output || 'Run your code to see results.'}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "console" && (
          <div className="h-full overflow-auto p-4 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Console Output & Errors</h3>
            </div>
            
            {consoleMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TerminalIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No console output yet.</p>
                <p className="text-sm">Run your code to see detailed logs and errors.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {consoleMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border-l-4 ${getMessageColor(msg.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getMessageIcon(msg.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {msg.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {msg.timestamp}
                          </span>
                        </div>
                        <pre className="mt-1 text-sm font-mono whitespace-pre-wrap break-words">
                          {msg.message}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;