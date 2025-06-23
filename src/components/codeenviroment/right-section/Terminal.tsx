import React, { useState, useEffect } from 'react';
import {
  Play,
  Terminal as TerminalIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  Bug,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from 'lucide-react';
import { useTheme } from './ThemeContext';

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
  selectedProblem,
}) => {
  const [activeTab, setActiveTab] = useState<string>('testcases');
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<number>(1);

  // Use centralized theme
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('editor-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'editor-theme') {
        setIsDarkMode(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function sanitizeForTerminal(raw: string): string {
    return raw
      .replace(/^.*?=\s*/, '') // remove labels like "height ="
      .replace(/\\([[\]{}()])/g, '$1') // unescape backslashed brackets
      .replace(/[\[\]{}]/g, (match) => match) // optionally keep or remove [] {} ()
      .replace(/\\n/g, '\n') // handle \n literals
      .replace(/\\t/g, '\t') // handle \t literals
      .replace(/\s+/g, ' ') // compress extra whitespace
      .trim();
  }

  // Generate test cases from problem data + custom cases
  const allTestCases = React.useMemo(() => {
    const problemTestCases: TestCase[] =
      selectedProblem?.examples?.map((example, index) => ({
        id: index + 1,
        input: sanitizeForTerminal(example.input),
        expected: sanitizeForTerminal(example.output),
        isCustom: false,
      })) || [];

    return [...problemTestCases, ...customTestCases];
  }, [selectedProblem?.examples, customTestCases]);

  // Reset selected test case when problem changes
  React.useEffect(() => {
    if (
      allTestCases.length > 0 &&
      !allTestCases.find((tc) => tc.id === selectedTestCase)
    ) {
      setSelectedTestCase(allTestCases[0].id);
    }
  }, [allTestCases, selectedTestCase]);

  const addCustomTestCase = () => {
    const newId = Math.max(...allTestCases.map((tc) => tc.id), 0) + 1;
    const newCustomCase = {
      id: newId,
      input: '',
      expected: '',
      isCustom: true,
    };
    setCustomTestCases([...customTestCases, newCustomCase]);
    setSelectedTestCase(newId);
  };

  const removeTestCase = (id: number) => {
    const updatedCustomCases = customTestCases.filter((tc) => tc.id !== id);
    setCustomTestCases(updatedCustomCases);
    if (selectedTestCase === id && allTestCases.length > 1) {
      const remainingCases = allTestCases.filter((tc) => tc.id !== id);
      setSelectedTestCase(remainingCases[0]?.id || 1);
    }
  };

  const updateTestCase = (
    id: number,
    field: 'input' | 'expected',
    value: string,
  ) => {
    setCustomTestCases(
      customTestCases.map((tc) =>
        tc.id === id ? { ...tc, [field]: value } : tc,
      ),
    );
  };

  const handleRunTests = () => {
    runTestCases(allTestCases);
  };

  const selectedTest = allTestCases.find((tc) => tc.id === selectedTestCase);

  // Parse console messages
  const parseConsoleMessages = (
    consoleText: string,
    errorText: string,
  ): ConsoleMessage[] => {
    const messages: ConsoleMessage[] = [];
    const timestamp = new Date().toLocaleTimeString();

    if (consoleText) {
      consoleText.split('\n').forEach((line) => {
        if (line.trim()) {
          messages.push({
            type: 'info',
            message: line,
            timestamp,
          });
        }
      });
    }

    if (errorText) {
      errorText.split('\n').forEach((line) => {
        if (line.trim()) {
          messages.push({
            type: 'error',
            message: line,
            timestamp,
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
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <TerminalIcon className="h-4 w-4 text-blue-500" />;
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
    <div
      className={`flex h-full flex-col ${themeClasses.terminalBg} ${themeClasses.borderColor} border-t`}
    >
      {/* Header with Collapse Button */}
      <div
        className={`flex items-center justify-between px-4 py-2 ${themeClasses.terminalHeaderBg} ${themeClasses.terminalHeaderBorder} min-h-[48px] border-b`}
      >
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('testcases')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'testcases'
                ? themeClasses.terminalTabActive
                : themeClasses.terminalTabInactive
            }`}
          >
            Test Cases
            {testResults.length > 0 && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                  testResults.every((r) => r.passed)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {testResults.filter((r) => r.passed).length}/
                {testResults.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'output'
                ? themeClasses.terminalTabActive
                : themeClasses.terminalTabInactive
            }`}
          >
            Output
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'console'
                ? themeClasses.terminalTabActive
                : themeClasses.terminalTabInactive
            }`}
          >
            Console
            {consoleMessages.length > 0 && (
              <span className="ml-2 rounded-full border border-gray-300 bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
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
            className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                Running
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Run
              </>
            )}
          </button>

          <button
            onClick={handleRunTests}
            disabled={testLoading}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {testLoading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                Testing
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3" />
                Test
              </>
            )}
          </button>

          {/* Collapse Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              title="Collapse terminal"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'testcases' && (
          <div className="flex h-full">
            {/* Test Case List */}
            <div
              className={`w-80 ${themeClasses.terminalHeaderBg} ${themeClasses.terminalHeaderBorder} overflow-auto border-r`}
            >
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className={`font-semibold ${themeClasses.terminalHeaderText}`}
                  >
                    Test Cases
                  </h3>
                  <button
                    onClick={addCustomTestCase}
                    className="rounded-md bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700"
                    title="Add custom test case"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {allTestCases.map((testCase, index) => {
                  const displayIndex = testCase.isCustom
                    ? 'Custom'
                    : `Case ${index + 1}`;
                  const testResult = testResults.find(
                    (r) => r.testCase === testCase.id,
                  );

                  return (
                    <div
                      key={testCase.id}
                      className={`mb-2 cursor-pointer rounded border p-3 transition-colors ${
                        selectedTestCase === testCase.id
                          ? `${themeClasses.terminalInputBg} ${themeClasses.terminalInputBorder} border-2`
                          : `${themeClasses.terminalHeaderBg} ${themeClasses.terminalHeaderBorder} hover:${themeClasses.terminalInputBg}`
                      }`}
                      onClick={() => setSelectedTestCase(testCase.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${themeClasses.terminalText}`}
                          >
                            {displayIndex}
                          </span>
                          {testResult &&
                            (testResult.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ))}
                        </div>
                        {testCase.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTestCase(testCase.id);
                            }}
                            className="p-0.5 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {testResult && (
                        <div className="mt-2 text-xs">
                          <span
                            className={`rounded px-2 py-1 font-medium ${
                              testResult.passed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {testResult.passed ? 'PASSED' : 'FAILED'}
                          </span>
                          {testResult.executionTime && (
                            <span className="ml-2 text-gray-500">
                              {testResult.executionTime < 1000
                                ? `${testResult.executionTime}ms`
                                : `${(testResult.executionTime / 1000).toFixed(2)}s`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Case Details & Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedTest ? (
                <div className="space-y-4">
                  {/* Input Section */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Input:
                    </label>
                    {selectedTest.isCustom ? (
                      <textarea
                        value={selectedTest.input}
                        onChange={(e) =>
                          updateTestCase(
                            selectedTest.id,
                            'input',
                            e.target.value,
                          )
                        }
                        className={`h-24 w-full resize-none rounded-md border p-3 font-mono text-sm ${themeClasses.terminalInputBg} ${themeClasses.terminalInputBorder} ${themeClasses.terminalInputText}`}
                        placeholder="Enter test input..."
                      />
                    ) : (
                      <div
                        className={`h-24 w-full overflow-auto rounded-md border p-3 font-mono text-sm ${themeClasses.terminalInputBg} ${themeClasses.terminalInputBorder} ${themeClasses.terminalInputText}`}
                      >
                        {selectedTest.input}
                      </div>
                    )}
                  </div>

                  {/* Expected Output Section */}
                  {selectedTest.expected && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Expected Output:
                      </label>
                      {selectedTest.isCustom ? (
                        <textarea
                          value={selectedTest.expected || ''}
                          onChange={(e) =>
                            updateTestCase(
                              selectedTest.id,
                              'expected',
                              e.target.value,
                            )
                          }
                          className={`h-24 w-full resize-none rounded-md border p-3 font-mono text-sm ${themeClasses.terminalInputBg} ${themeClasses.terminalInputBorder} ${themeClasses.terminalInputText}`}
                          placeholder="Enter expected output..."
                        />
                      ) : (
                        <div
                          className={`h-24 w-full overflow-auto rounded-md border p-3 font-mono text-sm ${themeClasses.terminalInputBg} ${themeClasses.terminalInputBorder} ${themeClasses.terminalInputText}`}
                        >
                          {selectedTest.expected}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Test Result */}
                  {(() => {
                    const testResult = testResults.find(
                      (r) => r.testCase === selectedTest.id,
                    );
                    if (!testResult) return null;

                    return (
                      <div
                        className={`rounded-lg border-l-4 p-4 ${
                          testResult.passed
                            ? 'border-green-400 bg-green-50'
                            : 'border-red-400 bg-red-50'
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          {testResult.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium text-gray-700">
                            Test Result
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              testResult.passed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {testResult.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Actual Output:
                            </span>
                            <div
                              className={`mt-1 rounded p-2 font-mono text-xs ${
                                testResult.passed
                                  ? 'bg-green-100 text-gray-700'
                                  : 'bg-red-100 text-gray-700'
                              }`}
                            >
                              {testResult.actual}
                            </div>
                          </div>

                          {testResult.error && (
                            <div>
                              <span className="font-medium text-red-700">
                                Error:
                              </span>
                              <div className="mt-1 rounded bg-red-100 p-2 font-mono text-xs text-red-800">
                                {testResult.error}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>Select a test case to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Output */}
        {activeTab === 'output' && (
          <div className="h-full overflow-auto p-4">
            <div className="mb-4 flex items-center gap-2">
              <TerminalIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Program Output</h3>
            </div>

            <div className="h-full overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
              <pre className="whitespace-pre-wrap break-words">
                {output || 'Run your code to see results.'}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="h-full space-y-3 overflow-auto p-4">
            <div className="mb-4 flex items-center gap-2">
              <Bug className={`h-5 w-5 ${themeClasses.iconColor}`} />
              <h3
                className={`font-semibold ${themeClasses.terminalHeaderText}`}
              >
                Console Output & Errors
              </h3>
            </div>

            {consoleMessages.length === 0 ? (
              <div
                className={`py-8 text-center ${themeClasses.terminalTabInactive}`}
              >
                <TerminalIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No console output yet.</p>
                <p className="text-sm">
                  Run your code to see detailed logs and errors.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {consoleMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`rounded-md border-l-4 p-3 ${getMessageColor(msg.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getMessageIcon(msg.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            {msg.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {msg.timestamp}
                          </span>
                        </div>
                        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm">
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
