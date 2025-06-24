import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const bedrock = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-1',
});

export const handler = async (event: any) => {
  const body = event.body ? JSON.parse(event.body) : event;
  const { query, context = '', problemTitle = '' } = body;

  // Validate input
  if (!query || query.trim().length < 3) {
    return createResponse(
      "I need a bit more detail! Ask me something like 'How do I use lists?' or 'Help with loops'",
    );
  }

  try {
    const tutorResponse = await generateHint(query, context, problemTitle);
    return createResponse(tutorResponse);
  } catch (error) {
    console.error('AI Tutor error:', error);
    return createResponse("Oops! I'm having a moment. Try asking again! 😊");
  }
};

async function generateHint(
  query: string,
  context: string,
  problemTitle: string,
) {
  const tutorPrompt = `You are a helpful coding tutor. A student is working on: "${problemTitle || 'a coding problem'}"

Student's question: "${query}"
${context ? `Problem context: ${context}` : ''}

Give a helpful hint that:
- Guides their thinking without giving the full solution
- Suggests relevant concepts or approaches
- Includes a small example if helpful
- Keeps it simple and encouraging

Keep your response under 3 sentences.`;

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: tutorPrompt,
        },
      ],
    }),
  });

  const response = await bedrock.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.content[0].text;
}

function createResponse(message: string) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response: message,
      success: true,
    }),
  };
}
