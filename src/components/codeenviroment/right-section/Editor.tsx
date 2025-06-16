import React, { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { Play, Settings, Code } from 'lucide-react';

interface EditorProps {
  input: string;
  setInput: (input: string) => void;
  setLanguage: (language: string) => void;
  runCode: () => Promise<void>;
  loading: boolean;
}

const Editor: React.FC<EditorProps> = ({ input, setInput, setLanguage, runCode, loading }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  const handleChange = useCallback((value: string) => {
    setInput(value);
  }, [setInput]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const getLanguageExtension = () => {
    switch (selectedLanguage) {
      case 'python': return python();
      case 'java': return java();
      case 'cpp': return cpp();
      case 'javascript': return javascript();
      default: return python();
    }
  };

  const getLanguageTemplate = (language: string) => {
    switch (language) {
      case 'python':
        return `# Welcome to the code editor!
# Write your Python solution here

def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`;
      
      case 'java':
        return `// Welcome to the code editor!
// Write your Java solution here

public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println("Hello World");
    }
    
    // Your solution method here
}`;
      
      case 'cpp':
        return `// Welcome to the code editor!
// Write your C++ solution here

#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    // Your solution method here
};

int main() {
    Solution sol;
    // Test your solution
    cout << "Hello World" << endl;
    return 0;
}`;
      
      case 'javascript':
        return `// Welcome to the code editor!
// Write your JavaScript solution here

function solution() {
    // Your code here
}

// Test your solution
console.log("Hello World");`;
      
      default:
        return '';
    }
  };

  const handleLanguageChangeWithTemplate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setLanguage(newLanguage);
    
    // If editor is empty, provide template
    if (!input.trim()) {
      setInput(getLanguageTemplate(newLanguage));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Code Editor</h3>
          
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedLanguage}
              onChange={handleLanguageChangeWithTemplate}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors text-sm font-medium"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1">
        <CodeMirror
          value={input}
          height="100%"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            autocompletion: true,
            closeBrackets: true,
            history: true,
            indentOnInput: true,
            bracketMatching: true,
            searchKeymap: true
          }}
          extensions={[getLanguageExtension()]}
          onChange={(value) => handleChange(value)}
          theme="light"
          placeholder={`Start coding in ${selectedLanguage}...`}
        />
      </div>
    </div>
  );
};

export default Editor;