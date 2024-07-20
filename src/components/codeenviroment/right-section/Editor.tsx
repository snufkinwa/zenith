import React, { useCallback } from 'react';
import  CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import styles from "../CodeEnvironment.module.css";

interface EditorProps {
  input: string;
  setInput: (input: string) => void;
}

const Editor: React.FC<EditorProps> = ({ input, setInput }) => {
  const handleChange = useCallback((value: string) => {
    setInput(value);
  }, [setInput]);

  const extensions = [python()];

  return (
    <div className={styles.codingarea}>
      <div className={styles.editorHeader}></div>
      <CodeMirror
        value={input}
        height="63vh"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          autocompletion: false,
          closeBrackets: false,
          history: false
        }}
        extensions={[python()]}
        onChange={(value) => handleChange(value)}
      />
    </div>
  );
};

export default Editor;



