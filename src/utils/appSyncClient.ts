// utils/appSyncClient.ts
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

// Configure Amplify
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_ENDPOINT!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      defaultAuthMode: 'oidc',
    },
  },
});

const client = generateClient();

// GraphQL operations using your exact schema
const CREATE_SESSION = `
  mutation CreateZenithSessions($input: CreateZenithSessionsInput!) {
    createZenithSessions(input: $input) {
      sessionId
      timestamp
      userId
      problemId
      mode
      status
      collaborators
      lastUpdated
    }
  }
`;

const GET_SESSION = `
  query GetZenithSessions($sessionId: ID!, $timestamp: AWSTimestamp!) {
    getZenithSessions(sessionId: $sessionId, timestamp: $timestamp) {
      sessionId
      timestamp
      userId
      problemId
      mode
      status
      collaborators
      lastUpdated
      finalAnswer
    }
  }
`;

const UPDATE_SESSION = `
  mutation UpdateZenithSessions($input: UpdateZenithSessionsInput!) {
    updateZenithSessions(input: $input) {
      sessionId
      timestamp
      userId
      problemId
      mode
      status
      collaborators
      lastUpdated
    }
  }
`;

// Simple client functions
export const sessionAPI = {
  async createSession(sessionData: any) {
    const timestamp = Math.floor(Date.now() / 1000);

    try {
      const result = await client.graphql({
        query: CREATE_SESSION,
        variables: {
          input: {
            sessionId: sessionData.sessionId,
            timestamp: timestamp,
            userId: sessionData.userId,
            problemId: sessionData.problemId,
            mode: 'collaboration',
            status: 'active',
            lastUpdated: timestamp,
            collaborators: JSON.stringify([
              {
                id: sessionData.userId,
                name: sessionData.userName,
                email: sessionData.userEmail,
                joinedAt: timestamp,
              },
            ]),
          },
        },
      });
      if ('data' in result && result.data) {
        return result.data.createZenithSessions;
      }
      return null;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  async getSession(sessionId: string, timestamp: number) {
    try {
      const result = await client.graphql({
        query: GET_SESSION,
        variables: { sessionId, timestamp },
      });
      if ('data' in result && result.data) {
        return result.data.getZenithSessions;
      }
      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  async updateSession(sessionId: string, timestamp: number, updates: any) {
    try {
      const result = await client.graphql({
        query: UPDATE_SESSION,
        variables: {
          input: {
            sessionId,
            timestamp,
            lastUpdated: Math.floor(Date.now() / 1000),
            ...updates,
          },
        },
      });
      if ('data' in result && result.data) {
        return result.data.updateZenithSessions;
      }
      return null;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },
};
