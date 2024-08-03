import React, { useState, useEffect } from "react";
import { usePyodide } from "../../hooks/usePyodide";
import Editor from "./right-section/Editor";
import Terminal from "./right-section/Terminal";
import ProblemList from "./left-section/question/ProblemList";
import Sidebar from "./left-section/Sidebar";
import styles from "./CodeEnvironment.module.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string | null;
  content: string;
}

const CodeEnvironment: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const pyodide = usePyodide();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const runCode = () => {
    if (pyodide) {
      try {
        pyodide.runPython(`
          import io
          import sys
          sys.stdout = io.StringIO()
        `);
        pyodide.loadPackagesFromImports(input);
        const result = pyodide.runPython(input);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(
          stdout + (result !== undefined ? "\n" + result.toString() : "")
        );
      } catch (error: unknown) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = `Error: ${error.message}`;
          if ("stack" in error) {
            errorMessage += `\n\nStack trace:\n${error.stack}`;
          }
        } else if (typeof error === "string") {
          errorMessage = `Error: ${error}`;
        } else {
          errorMessage = "An unknown error occurred";
        }
        setOutput(errorMessage);
      }
    }
  };

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setInput("");
  };

  return (
    <PanelGroup direction="horizontal" className={styles.maincontainer}>
      <Panel minSize={0} defaultSize={50}>
        <div className={styles.problem}>   
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.generateProblem}>
            PROBLEM
          </div>
        </div>
      </Panel>
      
      <PanelResizeHandle className={styles.resizeHandle} />
      
      <Panel minSize={0}>
        <div className={styles.codecontainer}>
          <div className={styles.editor}>
            <Editor input={input} setInput={setInput} />
          </div>
          <div className={styles.terminal}>
            <Terminal output={output} runCode={runCode} />
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default CodeEnvironment;