export interface codeProblem {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    content: string;
  }
  
  export interface codeSolution {
    id: string;
    slug: string;
    answer: {
      "c++": string;
      java: string;
      python: string;
      javascript: string;
      explanation: string;
    };
  }
  