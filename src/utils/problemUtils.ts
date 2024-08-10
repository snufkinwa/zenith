import { LLM, type BaseLLMParams } from "@langchain/core/language_models/llms";
import { OpenAI } from "@langchain/openai";
import type { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { GenerationChunk } from "@langchain/core/outputs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { codeProblem, codeSolution } from "@/types/problemTypes";

// Importing the datasets directly
import problemsData from "@public/data/problems.json";
import solutionsData from "@public/data/solution.json";

const problems: codeProblem[] = problemsData as codeProblem[];
const solutions: codeSolution[] = solutionsData as codeSolution[];

// Custom LLM class
interface CustomLLMInput extends BaseLLMParams {
  n: number;
}

const model = new OpenAI({ 
    modelName: "gpt-3.5-turbo", 
    temperature: 0.7
  });

class CustomLLM extends LLM {
  n: number;

  constructor(fields: CustomLLMInput) {
    super(fields);
    this.n = fields.n;
  }

  _llmType() {
    return "custom";
  }

  async _call(
    prompt: string,
    options: this["ParsedCallOptions"],
    runManager: CallbackManagerForLLMRun
  ): Promise<string> {
    return prompt.slice(0, this.n);
  }

  async *_streamResponseChunks(
    prompt: string,
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<GenerationChunk> {
    for (const letter of prompt.slice(0, this.n)) {
      yield new GenerationChunk({
        text: letter,
      });
      await runManager?.handleLLMNewToken(letter);
    }
  }
}

// Initialize the custom LLM
const customLLM = new CustomLLM({ n: 100 });

// Function to load problem dataset
async function loadProblemDataset(): Promise<MemoryVectorStore> {
  const documents = problems.map((problem: codeProblem) => {
    const solution = solutions.find((s: codeSolution) => s.id === problem.id);
    return new Document({
      pageContent: `
        ID: ${problem.id}
        Slug: ${problem.slug}
        Title: ${problem.title}
        Difficulty: ${problem.difficulty}
        Content: ${problem.content}
        C++ Solution: ${solution?.answer["c++"]}
        Java Solution: ${solution?.answer.java}
        Python Solution: ${solution?.answer.python}
        JavaScript Solution: ${solution?.answer.javascript}
        Explanation: ${solution?.answer.explanation}
      `,
      metadata: { 
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty
      }
    });
  });

  return await MemoryVectorStore.fromDocuments(documents, new OpenAIEmbeddings());
}

// Function to generate a problem
async function generateProblem(
  vectorStore: MemoryVectorStore, 
  difficulty: string,
  topics: string[]
): Promise<string> {
  const relevantDocs = await vectorStore.similaritySearch(
    `Difficulty: ${difficulty}, Topics: ${topics.join(', ')}`,
    3
  );

  const problemPrompt = `
    You are an expert problem setter for coding challenges. 
    Use the following similar problems as inspiration, but DO NOT copy them directly:

    ${relevantDocs.map(doc => doc.pageContent).join('\n\n')}

    Create a new, unique coding problem with the following characteristics:
    Difficulty: ${difficulty}
    Topics: ${topics.join(', ')}

    The problem should include:
    1. A descriptive title
    2. A clear, original problem statement
    3. Input format and constraints
    4. Output format
    5. At least two detailed example cases with explanations
    6. Any necessary constraints on input size and values

    Format the problem similarly to the examples provided, using Markdown for formatting.
  `;

  const result = await model.call(problemPrompt);
  return result;
}

// Function to analyze a solution
async function analyzeSolution(
  vectorStore: MemoryVectorStore,
  problemId: string,
  userSolution: string,
  language: string
): Promise<string> {
  const relevantDocs = await vectorStore.similaritySearch(`ID: ${problemId}`, 1);

  const analysisPrompt = `
    You are an expert code reviewer. Analyze the following user solution for the given problem:

    Problem:
    ${relevantDocs[0].pageContent.split('Content:')[1].split('C++ Solution:')[0].trim()}

    User's ${language} solution:
    ${userSolution}

    Reference solution in ${language}:
    ${relevantDocs[0].pageContent.split(`${language} Solution:`)[1].split('\n')[0]}

    Provide a detailed analysis including:
    1. Correctness: Does the solution solve the problem? Are there any edge cases it might miss?
    2. Efficiency: Analyze the time and space complexity. How does it compare to the optimal solution?
    3. Code style: Comment on the readability and adherence to best practices in ${language}.
    4. Potential improvements: Suggest any optimizations or alternative approaches.
    5. Learning opportunities: Highlight any interesting techniques or concepts used in the reference solution that could benefit the user.

    Be constructive and encouraging in your feedback.
  `;

  const result = await customLLM.call(analysisPrompt, {});
  return result;
}

// Now you can call loadProblemDataset and other functions as needed in your application
loadProblemDataset().then(vectorStore => {
  // Use the vectorStore in your application
});
