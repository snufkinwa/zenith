import { defineFunction } from '@aws-amplify/backend';

export const aiTutor = defineFunction({
  name: 'ai-tutor',
  entry: './handler.ts',
  environment: {
    BEDROCK_REGION: 'us-east-1',
  },
  timeoutSeconds: 30,
});
