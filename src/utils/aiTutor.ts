export class AITutor {
  private static readonly TUTOR_URL =
    process.env.NEXT_PUBLIC_AI_TUTOR_LAMBDA_URL!;

  static async askQuestion(
    question: string,
    context?: string,
  ): Promise<string> {
    // Basic validation
    if (!question || question.trim().length < 3) {
      return "I'd love to help! Could you ask me a more specific question about coding? For example: 'How do I use Python lists?' or 'What is a function?'";
    }

    try {
      const response = await fetch(this.TUTOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question.trim(),
          context: context || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Tutor service unavailable');
      }

      const data = await response.json();
      return (
        data.response ||
        "I'm having trouble right now, but keep coding! You're doing great! 🎉"
      );
    } catch (error) {
      console.error('AI Tutor error:', error);
      return "I'm having a moment! Could you try asking again? I'm here to help you learn! 😊";
    }
  }

  static async getHint(
    problemTitle: string,
    currentCode: string,
  ): Promise<string> {
    const question = `I'm working on ${problemTitle}. Here's my code so far: ${currentCode || "I haven't started yet"}. Can you give me a hint?`;
    return this.askQuestion(question);
  }

  static async explainConcept(concept: string): Promise<string> {
    const question = `Can you explain ${concept} in simple terms with an example?`;
    return this.askQuestion(question);
  }
}
