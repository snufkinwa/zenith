import React, { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Code } from 'lucide-react';

interface EditorProps {
  input: string;
  setInput: (input: string) => void;
  problemSlug?: string; // Add this prop to know which problem is selected
}

const Editor: React.FC<EditorProps> = ({ input, setInput, problemSlug }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('/data/templates.json');
        const templateData = await response.json();
        setTemplates(templateData);
        setTemplatesLoaded(true);
        console.log('Templates loaded:', templateData.length, 'templates');
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplatesLoaded(true);
      }
    };
    loadTemplates();
  }, []);

  const handleChange = useCallback((value: string) => {
    setInput(value);
  }, [setInput]);

  const getTemplateForProblem = (slug: string): string => {
    const template = templates.find(t => t.slug === slug);
    if (template) {
      // Template is already perfect - just return it
      return template.template;
    }
    return getDefaultTemplate();
  };

  const getDefaultTemplate = () => {
    return `class Solution:
    def solve(self):
        # Write your code here
        pass

if __name__ == "__main__":
    sol = Solution()
    print(sol.solve())`;
  };

  // Load template when problem changes
  useEffect(() => {
    if (!templatesLoaded) return;

    if (problemSlug) {
      const template = getTemplateForProblem(problemSlug);
      setInput(template);
      console.log('Loaded template for problem:', problemSlug);
    } else if (!input) {
      setInput(getDefaultTemplate());
    }
  }, [problemSlug, templatesLoaded, getTemplateForProblem, setInput, getDefaultTemplate, input]);

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header - Simplified for Python only */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Code Editor</h3>
        </div>
        {/* Python Language Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
            <span>🐍</span>
            <span>Python</span>
          </div>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1">
        <CodeMirror
          value={input}
          height="100%"
          basicSetup={{
            lineNumbers: false,
            foldGutter: true,
            highlightActiveLine: true,
            autocompletion: true,
            closeBrackets: true,
            history: true,
            indentOnInput: true,
            bracketMatching: true,
            searchKeymap: true
          }}
          extensions={[python()]} // Only Python extension
          onChange={(value) => handleChange(value)}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Editor;