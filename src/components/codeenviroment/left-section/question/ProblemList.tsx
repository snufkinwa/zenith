import React, { useEffect } from "react";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string | null;
  content: string;
}

interface ProblemListProps {
  problems: Problem[];
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
}) => {
  useEffect(() => {
    if (problems.length > 0 && !selectedProblem) {
      const randomProblem =
        problems[Math.floor(Math.random() * problems.length)];
      onSelectProblem(randomProblem);
    }
  }, [problems, onSelectProblem, selectedProblem]);

  return (
    <div>
      <h2>Problems</h2>
      <ul>
        {problems.map((problem) => (
          <React.Fragment key={problem.id}>
            <li>{problem.title}</li>
            <li>{problem.difficulty}</li>
            <li>{problem.content}</li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;