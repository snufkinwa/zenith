import { type NextRequest, NextResponse } from "next/server"
import { generateHint, searchHints } from "@/lib/ai-hints"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, context = "", type = "generate" } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required and must be a string" }, { status: 400 })
    }

    let result: string | object

    switch (type) {
      case "search":
        result = await searchHints(query)
        break
      case "generate":
      default:
        result = await generateHint(query, context)
        break
    }

    return NextResponse.json({ result }, { status: 200 })
  } catch (error: any) {
    console.error("Error in /api/hints POST:", error?.message || error)
    return NextResponse.json({ error: "Failed to generate hint" }, { status: 500 })
  }
}
