import React from "react";
import styles from "../CodeEnvironment.module.css";

interface TerminalProps {
  output: string;
  runCode: () => void;

}

const Terminal: React.FC<TerminalProps> = ({ output, runCode }) => {
  return (
    <div className={styles.terminalContainer}>
      <pre className={styles.output}>{output}</pre>
      <div className={styles.footerContainer}>
        <button onClick={runCode} className={styles.button}>
          Run Code
        </button>
        <button className={styles.button}>Test</button>
        <button className={styles.button}>Submit</button>
      </div>
    </div>
  );
};

export default Terminal;