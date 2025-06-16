import React, { useState, useEffect } from "react";
import { compileCode } from "../../actions/compile";
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

interface LanguageOption {
  language: string;
  version: string;
}

const languageOptions: { [key: string]: LanguageOption } = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  javascript: { language: "javascript", version: "18.15.0" },
};

const CodeEnvironment: React.FC<{ problems: Problem[] }> = ({ problems }) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const runCode = async () => {
    setLoading(true);
    const languageOption = languageOptions[language];
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: input,
        },
      ],
    };
    try {
      const result = await compileCode(requestData);
      setOutput(result.run.output.split("\n"));
      console.log(result);
      setLoading(false);
      setErr(false);
    } catch (error) {
      setErr(true);
      setLoading(false);
      console.log(error);
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
          <PanelGroup direction="vertical">
            <Panel>
              <div className={styles.editor}>
                <Editor input={input} setInput={setInput} setLanguage={setLanguage} />
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <div className={styles.terminal}>
                <Terminal output={output.join("\n")} runCode={runCode} loading={loading} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default CodeEnvironment;