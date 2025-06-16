import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import fs from "fs"
import path from "path"
import csv from "csv-parser"

const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.4, openAIApiKey: process.env.OPENAI_API_KEY, })

export async function generateHint(query: string, context = ""): Promise<string> {
  try {
    const messages = [
     new SystemMessage(`You are an expert Python programming tutor specializing in coding problem hints.

Guidelines:
- Provide helpful hints without giving away the complete solution
- Focus on algorithmic thinking and data structure selection
- Suggest relevant Python built-ins and methods when appropriate
- Keep explanations concise but educational
- Include small code snippets to illustrate concepts
- Guide the user's thinking process rather than solving for them

Your goal is to help students learn by discovery, not by copying solutions.`),
      new HumanMessage(`Context: ${context}\n\nQuestion: ${query}\n\nExplain it simply.`)
    ]

    const result = await chat.invoke(messages)
    
    return result.content.toString().trim()
  } catch (error) {
    console.error("Error generating hint:", error)
    return "Sorry, I couldn't generate a hint right now. Please try again."
  }
}

export async function searchHints(query: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "python_builtins_extended.csv")
  const lowerQuery = query.toLowerCase()

  if (!fs.existsSync(filePath)) {
    return "Hints database not found. Please ensure the CSV file exists."
  }

  return new Promise((resolve, reject) => {
    const results: string[] = []
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const keyword = row.function?.toLowerCase?.()
        const snippet = row.url || row.description || "No description available"
        
        if (keyword && lowerQuery.includes(keyword)) {
          results.push(`${row.function}: ${snippet}`)
        }
      })
      .on("end", () => {
        if (results.length > 0) {
          const limitedResults = results.slice(0, 5) 
          resolve(limitedResults.join("\n\n"))
        } else {
          resolve("No relevant hint found. Try rephrasing your question or using different keywords.")
        }
      })
      .on("error", (error: Error) => {
        console.error("CSV reading error:", error)
        reject(new Error("Failed to search hints database."))
      })
  })
}
