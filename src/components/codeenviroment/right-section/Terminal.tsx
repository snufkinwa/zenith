import React, { useState } from 'react';
import styles from "../CodeEnvironment.module.css";

interface TerminalProps {
  output: string;
  runCode: () => void;
  loading: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ 
  output, 
  runCode, 
  loading 
}) => {
  const [activeTab, setActiveTab] = useState<string>("output");

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalheader}>
        <div className="tab-list">
          <button 
            className={`tab ${activeTab === "output" ? "active" : ""}`} 
            onClick={() => setActiveTab("output")}
          >
            Output
          </button>
          <button 
            className={`tab ${activeTab === "custom" ? "active" : ""}`} 
            onClick={() => setActiveTab("custom")}
          >
            Custom Input
          </button>
        </div>
        <div className={styles.buttongroup}>
          <button onClick={runCode} className={styles.btnprimary} disabled={loading}>
            {loading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className= {styles.terminalcontent}>
        {activeTab === "output" && (
          <div className="output-container">
            <pre>{output || 'No output yet. Run your code to see results.'}</pre>
          </div>
        )}
        
        {activeTab === "custom" && (
          <textarea 
            className="custom-input"
            placeholder="Enter your custom input here..."
          />
        )}
      </div>
    </div>
  );
};

export default Terminal;