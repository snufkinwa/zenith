// src/components/codeenviroment/modals/PythonTutorModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Eye,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Code,
  Play,
  X,
} from 'lucide-react';
import DraggableModal from './DraggableModal';

// Add problemExamples to the props interface
interface PythonTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
  currentCode: string;
  problemTitle?: string;
  problemExamples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

const PythonTutorModal: React.FC<PythonTutorModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onBringToFront,
  currentCode,
  problemTitle,
  problemExamples,
}) => {
  const [tutorUrl, setTutorUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [codeToVisualize, setCodeToVisualize] = useState<string>('');

  // Initialize code when modal opens
  useEffect(() => {
    if (isOpen && currentCode) {
      const processedCode = processCodeForVisualization(
        currentCode,
        problemExamples,
      );
      setCodeToVisualize(processedCode);
    }
  }, [isOpen, currentCode, problemExamples]);

  // Process code for Python Tutor - strip Solution class and add example execution
  const processCodeForVisualization = (
    code: string,
    problemExamples?: any[],
  ): string => {
    try {
      let processedCode = code.trim();

      // Check if code contains Solution class pattern
      const hasSolutionClass = /class\s+Solution\s*:/i.test(processedCode);

      if (hasSolutionClass) {
        // Extract function from Solution class
        const functionMatch = processedCode.match(/def\s+(\w+)\s*\([^)]*\):/);
        if (functionMatch) {
          const functionName = functionMatch[1];

          // Extract the function body (everything inside the method)
          const lines = processedCode.split('\n');
          let functionLines: string[] = [];
          let inFunction = false;
          let functionIndent = 0;

          for (const line of lines) {
            if (line.trim().startsWith(`def ${functionName}`)) {
              inFunction = true;
              functionIndent = line.search(/\S/); // Find indentation level
              // Remove 'self' parameter from function definition
              const cleanedDef = line
                .replace(/\(self,?\s*/, '(')
                .replace(/\(,\s*/, '(');
              functionLines.push(cleanedDef.replace(/^\s{4}/, '')); // Remove class indentation
              continue;
            }

            if (inFunction) {
              const currentIndent = line.search(/\S/);
              // If we hit a line that's not part of the function (less indented), stop
              if (line.trim() && currentIndent <= functionIndent) {
                break;
              }
              // Remove class-level indentation (typically 4 spaces)
              const processedLine = line.replace(/^\s{4}/, '');
              functionLines.push(processedLine);
            }
          }

          // Build the standalone function
          processedCode = functionLines.join('\n');

          // Add example execution if we have problem examples
          if (problemExamples && problemExamples.length > 0) {
            const firstExample = problemExamples[0];
            if (firstExample.input && firstExample.output) {
              processedCode += '\n\n# Example execution:\n';

              try {
                // Parse the input to create a function call
                const inputStr = firstExample.input.trim();

                // Handle different input formats
                let functionCall = '';
                if (inputStr.includes('=')) {
                  // Format: nums = [2,7,11,15], target = 9
                  const parts = inputStr
                    .split(',')
                    .map((part: string) => part.trim());
                  const args = parts
                    .map((part: string) => {
                      const value = part.split('=')[1]?.trim();
                      return value || part;
                    })
                    .join(', ');
                  functionCall = `${functionName}(${args})`;
                } else {
                  // Assume it's already in function call format or simple values
                  functionCall = `${functionName}(${inputStr})`;
                }

                processedCode += `result = ${functionCall}\n`;
                processedCode += `print(f"Input: ${inputStr}")\n`;
                processedCode += `print(f"Output: {result}")\n`;
                processedCode += `print(f"Expected: ${firstExample.output}")\n`;
              } catch (e) {
                // Fallback if parsing fails
                processedCode += `# Example input: ${firstExample.input}\n`;
                processedCode += `# Expected output: ${firstExample.output}\n`;
                processedCode += `# Call the function manually above\n`;
              }
            }
          }
        }
      } else {
        // If no Solution class, add example execution if available
        if (problemExamples && problemExamples.length > 0) {
          const firstExample = problemExamples[0];
          processedCode += '\n\n# Example execution:\n';
          processedCode += `# Input: ${firstExample.input}\n`;
          processedCode += `# Expected output: ${firstExample.output}\n`;
        }
      }

      return processedCode;
    } catch (error) {
      console.error('Error processing code:', error);
      return code; // Return original code if processing fails
    }
  };

  // Generate Python Tutor URL
  const generateTutorUrl = (code: string): string => {
    try {
      // Clean the code and prepare for URL encoding
      const cleanCode = code.trim();
      if (!cleanCode) {
        throw new Error('No code to visualize');
      }

      // Base Python Tutor URL - using the correct embed format
      const baseUrl = 'https://pythontutor.com/iframe-embed.html';

      // Manual URL construction to avoid encoding issues
      const encodedCode = encodeURIComponent(cleanCode);

      // Construct URL with proper parameters for Python Tutor
      const url = `${baseUrl}#code=${encodedCode}&cumulative=false&curInstr=0&heapPrimitives=nevernest&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false`;

      return url;
    } catch (err) {
      throw new Error('Failed to generate visualization URL');
    }
  };

  const handleVisualize = async () => {
    if (!codeToVisualize.trim()) {
      setError('Please enter some Python code to visualize');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const url = generateTutorUrl(codeToVisualize);
      setTutorUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create visualization',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (!codeToVisualize.trim()) {
      setError('Please enter some Python code to visualize');
      return;
    }

    try {
      const cleanCode = codeToVisualize.trim();
      const encodedCode = encodeURIComponent(cleanCode);

      // Direct link to Python Tutor (not iframe)
      const directUrl = `https://pythontutor.com/visualize.html#code=${encodedCode}&cumulative=false&curInstr=0&heapPrimitives=nevernest&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false`;

      window.open(directUrl, '_blank');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to open visualization',
      );
    }
  };

  const handleReset = () => {
    setTutorUrl('');
    setError('');
    setCodeToVisualize(currentCode);
  };

  const handleProcessCode = () => {
    const processedCode = processCodeForVisualization(
      codeToVisualize,
      problemExamples,
    );
    setCodeToVisualize(processedCode);
  };

  const isPythonCode = (code: string): boolean => {
    // Simple check for Python syntax
    const pythonKeywords = [
      'def ',
      'class ',
      'import ',
      'from ',
      'if __name__',
      'print(',
      'return',
    ];
    return pythonKeywords.some((keyword) => code.includes(keyword));
  };

  const getCodeWarning = (): string | null => {
    if (!codeToVisualize.trim()) return 'No code provided';
    if (!isPythonCode(codeToVisualize))
      return "This doesn't appear to be Python code";
    if (codeToVisualize.length > 3000)
      return 'Code is quite long - visualization may be slow';
    return null;
  };

  return (
    <DraggableModal
      title={`Python Tutor Visualizer${problemTitle ? ` - ${problemTitle}` : ''}`}
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 100, y: 50 }}
      initialSize={{ width: 900, height: 700 }}
      icon={<Eye size={16} className="text-yellow-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="flex h-full flex-col p-4">
        {/* Header with controls */}
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Code className="text-yellow-600" size={20} />
            <div>
              <h3 className="font-semibold text-gray-800">
                Python Code Visualization
              </h3>
              <p className="text-sm text-gray-600">
                Step through your code execution and see how variables change
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleProcessCode}
              className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-sm text-green-700 transition-colors hover:bg-green-200"
              title="Strip Solution class and add example execution"
            >
              <Code size={14} />
              Process Code
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              title="Reset to current editor code"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Code editor section */}
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Python Code to Visualize:
            </label>
            <button
              onClick={handleVisualize}
              disabled={isLoading || !codeToVisualize.trim()}
              className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Play size={16} />
              )}
              {isLoading ? 'Generating...' : 'Visualize'}
            </button>
          </div>

          <textarea
            value={codeToVisualize}
            onChange={(e) => setCodeToVisualize(e.target.value)}
            placeholder="Enter Python code here..."
            className="h-32 w-full resize-none rounded-md border border-gray-300 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            spellCheck={false}
          />

          {/* Code warnings */}
          {getCodeWarning() && (
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <AlertCircle className="flex-shrink-0 text-amber-600" size={16} />
              <span className="text-sm text-amber-800">{getCodeWarning()}</span>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
              <AlertCircle className="flex-shrink-0 text-red-600" size={16} />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}
        </div>

        {/* Python Tutor iframe */}
        <div className="flex-1 overflow-hidden rounded-md border border-gray-300 bg-gray-50">
          {tutorUrl ? (
            <iframe
              src={tutorUrl}
              className="h-full w-full"
              title="Python Tutor Visualization"
              frameBorder="0"
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <Eye size={48} className="mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium">No Visualization Yet</h3>
              <p className="max-w-md text-center text-sm">
                Enter your Python code above and click &quot;Visualize&quot; to see
                step-by-step execution with variable states and call stack
                visualization.
              </p>
            </div>
          )}
        </div>

        {/* Help section */}
        <div className="mt-4 border-t pt-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              💡 Tips for better visualization
            </summary>
            <div className="mt-2 space-y-1 pl-4 text-xs text-gray-600">
              <p>• Keep your code concise (under 50 lines works best)</p>
              <p>• Include print statements to see output</p>
              <p>• Use meaningful variable names</p>
              <p>• Avoid infinite loops or very long-running code</p>
              <p>
                • Works best with basic Python features (functions, loops,
                conditionals)
              </p>
            </div>
          </details>
        </div>
      </div>
    </DraggableModal>
  );
};

export default PythonTutorModal;
