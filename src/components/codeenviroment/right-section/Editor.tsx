import React, { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import styles from "../CodeEnvironment.module.css";

interface EditorProps {
  input: string;
  setInput: (input: string) => void;
  setLanguage: (language: string) => void;
}

const Editor: React.FC<EditorProps> = ({ input, setInput, setLanguage }) => {
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

  return (
    <div className={styles.codingarea}>
      <div className={styles.editorHeader}>
        <select 
          name="programming_language" 
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      <CodeMirror
        value={input}
        height="100vh"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          autocompletion: false,
          closeBrackets: false,
          history: false
        }}
        extensions={[getLanguageExtension()]}
        onChange={(value) => handleChange(value)}
      />
    </div>
  );
};

export default Editor;