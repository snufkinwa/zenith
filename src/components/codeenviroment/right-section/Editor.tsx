import React, { useCallback, useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Code, Moon, Sun } from 'lucide-react';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';

interface EditorProps {
  input: string;
  setInput: (input: string) => void;
  problemSlug?: string;
}

const Editor: React.FC<EditorProps> = ({ input, setInput, problemSlug }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [hasLoadedTemplate, setHasLoadedTemplate] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('editor-theme') === 'dark';
    }
    return false;
  });
  const lastProblemSlugRef = useRef<string | undefined>(undefined);

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

  // Load theme preference from localStorage and listen for changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'editor-theme') {
        setIsDarkMode(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setInput(value);
    },
    [setInput],
  );

  const toggleTheme = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('editor-theme', newMode ? 'dark' : 'light');

    // Trigger storage event for other components
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'editor-theme',
        newValue: newMode ? 'dark' : 'light',
      }),
    );
  }, [isDarkMode]);

  const getTemplateForProblem = useCallback(
    (slug: string): string => {
      const template = templates.find((t) => t.slug === slug);
      if (template) {
        return template.template;
      }
      return getDefaultTemplate();
    },
    [templates],
  );

  const getDefaultTemplate = useCallback(() => {
    return `class Solution:
    def solve(self):
        # Write your code here
        pass

if __name__ == "__main__":
    sol = Solution()
    print(sol.solve())`;
  }, []);

  // Load template when problem changes
  useEffect(() => {
    if (!templatesLoaded) return;

    // Check if the problem has actually changed
    const problemChanged = problemSlug !== lastProblemSlugRef.current;
    if (problemChanged) {
      lastProblemSlugRef.current = problemSlug;
      if (problemSlug) {
        const template = getTemplateForProblem(problemSlug);
        setInput(template);
        setHasLoadedTemplate(true);
        console.log('Loaded template for problem:', problemSlug);
      } else if (!hasLoadedTemplate) {
        // Only set default template if no template has been loaded yet
        setInput(getDefaultTemplate());
        setHasLoadedTemplate(true);
      }
    }
  }, [
    problemSlug,
    templatesLoaded,
    getTemplateForProblem,
    setInput,
    getDefaultTemplate,
    hasLoadedTemplate,
  ]);

  return (
    <div
      className={`flex h-full flex-col ${isDarkMode ? 'bg-[#1a1b26]' : 'bg-[#d5d6db]'}`}
    >
      {/* Editor Header */}
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isDarkMode
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <Code
            className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          />
          <h3
            className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
          >
            Code Editor
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`rounded-md p-2 transition-colors ${
              isDarkMode
                ? 'bg-[#414868] text-gray-300 hover:bg-[#4a5574]'
                : 'bg-[#c4c8da] text-[#33467c] hover:bg-[#b6bbd0]'
            }`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Python Language Indicator */}
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium ${
              isDarkMode
                ? 'bg-blue-900 text-blue-200'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            <span>🐍</span>
            <span>Python</span>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className={`flex-1 ${isDarkMode ? 'bg-[#1a1b26]' : 'bg-[#e1e2e7]'}`}>
        <CodeMirror
          value={input}
          height="100%"
          width="100%"
          basicSetup={{
            lineNumbers: false,
            foldGutter: true,
            highlightActiveLine: true,
            autocompletion: true,
            closeBrackets: true,
            history: true,
            indentOnInput: true,
            bracketMatching: true,
            searchKeymap: true,
            tabSize: 4,
          }}
          extensions={[python()]}
          onChange={handleChange}
          theme={isDarkMode ? tokyoNight : tokyoNightDay}
          editable={true}
        />
      </div>
    </div>
  );
};

export default Editor;
