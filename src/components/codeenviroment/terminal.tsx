import React, { useState } from 'react';
import { Play, Terminal as TerminalIcon, AlertCircle, CheckCircle, Clock, Bug } from 'lucide-react';

interface TerminalProps {
  output: string;
  consoleOutput: string;
  errors: string;
  runCode: () => Promise<void>;
  runTestCases: () => Promise<void>;
  loading: boolean;
  testLoading: boolean;
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
  testLoading
}) => {
  const [activeTab, setActiveTab] = useState<string>("output");

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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab("output")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "output" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab("console")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "console" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Console
              {consoleMessages.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {consoleMessages.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "custom" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Custom Input
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={runTestCases}
            disabled={testLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors"
          >
            {testLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Run Tests
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "output" && (
          <div className="p-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">
                {output || 'No output yet. Run your code to see results.'}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "console" && (
          <div className="p-4 space-y-3">
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

        {activeTab === "custom" && (
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Input
            </label>
            <textarea 
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your custom input here..."
              defaultValue=""
            />
            <p className="mt-2 text-xs text-gray-500">
              This input will be passed to your program when you run it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;