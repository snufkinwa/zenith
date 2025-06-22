import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { TavilySearch } from '@langchain/tavily';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const chat = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.4,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const searchTool = new TavilySearch({
  maxResults: 3,
  tavilyApiKey: process.env.TAVILY_API_KEY,
});

interface CSVHint {
  function?: string;
  topic?: string;
  concept?: string;
  description?: string;
  url?: string;
  source?: string;
  category?: string;
  type?: string;
  when_to_use?: string;
  python_implementation?: string;
  keywords?: string;
  example_problems?: string;
  hidden?: string;
}

export async function generateHint(
  query: string,
  context = '',
  useWebSearch = false,
): Promise<string> {
  try {
    let webContext = '';
    let csvContext = await searchAllCSVs(query);

    if (useWebSearch && process.env.TAVILY_API_KEY) {
      try {
        const webResults = await searchTool.invoke({
          query: query + ' programming algorithm',
        });
        webContext = webResults
          .map((result: any) => `${result.title}: ${result.content}`)
          .join('\n\n');
      } catch (error) {
        console.warn('Web search failed, continuing with CSV data:', error);
      }
    }

    let urlContent = '';
    if (csvContext) {
      urlContent = await fetchRelevantURLs(csvContext);
    }

    // Sanitize context
    csvContext = csvContext
      .replace(/CSV\s+Database\s+Results:/gi, '')
      .replace(/(file|csv|database)[^:\n]*:*/gi, '')
      .replace(
        /(csv\s+parsing|csv\s+data|csv\s+structure)/gi,
        'structured input',
      );

    const messages = [
      new SystemMessage(`You are an expert Python programming tutor specializing in coding problem hints.

Avoid mentioning implementation details like reading files, parsing CSVs, or interacting with databases unless explicitly asked by the user. Assume all content is already extracted and provided as background context.

Guidelines:
- Provide helpful hints without giving away the complete solution
- Focus on algorithmic thinking and data structure selection
- Suggest relevant Python built-ins and methods when appropriate
- Keep explanations concise but educational
- Include small code snippets to illustrate concepts
- Guide the user's thinking process rather than solving for them
- Use the information provided in context without mentioning CSVs, databases, or file names

Your goal is to help students learn by discovery, not by copying solutions.`),
      new HumanMessage(`
Context: ${context}

${csvContext}

${urlContent ? `Documentation Content:\n${urlContent}\n` : ''}
${webContext ? `Web Search Results:\n${webContext}\n` : ''}

Question: ${query}

Provide a helpful hint based on the above information.`),
    ];

    const result = await chat.invoke(messages);
    return result.content.toString().trim();
  } catch (error) {
    console.error('Error generating hint:', error);
    return "Sorry, I couldn't generate a hint right now. Please try again.";
  }
}

async function searchAllCSVs(query: string): Promise<string> {
  const csvFiles = [
    'python_builtins_extended.csv',
    'zenith_methods_concepts.csv',
    'python_doc_topics.csv',
    'zenith_pattern_guide.csv',
  ];

  const results: string[] = [];
  const lowerQuery = query.toLowerCase();

  for (const fileName of csvFiles) {
    const filePath = path.join(process.cwd(), 'public', 'data', fileName);
    if (!fs.existsSync(filePath)) continue;

    try {
      const csvResults = await searchCSV(filePath, lowerQuery);
      if (csvResults) {
        results.push(csvResults);
      }
    } catch (error) {
      console.error(`Error reading ${fileName}:`, error);
    }
  }

  return results.join('\n\n');
}

function searchCSV(filePath: string, query: string): Promise<string> {
  return new Promise((resolve) => {
    const results: CSVHint[] = [];

    if (query === 'csv') {
      resolve('');
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: CSVHint) => {
        if (row.hidden?.toLowerCase() === 'true') return;

        const searchFields = [
          row.function,
          row.topic,
          row.concept,
          row.description,
          row.category,
          row.type,
          row.keywords,
          row.when_to_use,
        ]
          .filter(Boolean)
          .map((field) => field?.toLowerCase() || '');

        if (searchFields.some((field) => field.includes(query))) {
          results.push(row);
        }
      })
      .on('end', () => {
        if (results.length > 0) {
          const formatted = results
            .slice(0, 3)
            .map((row) => {
              let result = '';
              if (row.function) result += `Function: ${row.function}\n`;
              if (row.topic) result += `Topic: ${row.topic}\n`;
              if (row.concept) result += `Concept: ${row.concept}\n`;
              if (row.description)
                result += `Description: ${row.description}\n`;
              if (row.when_to_use)
                result += `When to use: ${row.when_to_use}\n`;
              if (row.python_implementation)
                result += `Implementation: ${row.python_implementation}\n`;
              if (row.url) result += `Reference: ${row.url}\n`;
              return result;
            })
            .join('\n---\n');
          resolve(formatted);
        } else {
          resolve('');
        }
      });
  });
}

async function fetchRelevantURLs(csvContext: string): Promise<string> {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = csvContext.match(urlRegex) || [];

  if (urls.length === 0) return '';

  const contents: string[] = [];

  for (const url of urls.slice(0, 2)) {
    try {
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();
      if (docs[0]?.pageContent) {
        const truncated = docs[0].pageContent.substring(0, 1000);
        contents.push(`From ${url}:\n${truncated}...`);
      }
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error);
    }
  }

  return contents.join('\n\n');
}

export async function searchHints(
  query: string,
  useWebSearch = false,
): Promise<string> {
  const csvResults = await searchAllCSVs(query.toLowerCase());

  if (!csvResults && useWebSearch) {
    return generateHint(query, '', true);
  }

  return csvResults || 'No relevant hints found in the database.';
}
