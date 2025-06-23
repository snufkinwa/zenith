// utils/appSyncClient.ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

// Use the properly configured client from Amplify
const client = generateClient<Schema>();



export const sessionAPI = {
  async createSession(sessionData: any) {
    try {
      const result = await client.models.ZenithSession.create({
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        problemId: sessionData.problemId,
        mode: 'collaboration',
        status: 'active',
        lastUpdated: Math.floor(Date.now() / 1000),
        collaborators: JSON.stringify([{
          id: sessionData.userId,
          name: sessionData.userName,
          email: sessionData.userEmail,
          joinedAt: Math.floor(Date.now() / 1000),
        }]),
      });
      return result.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  async getSession(sessionId: string) {
    try {
      const result = await client.models.ZenithSession.get({ id: sessionId });
      return result.data;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  async updateSession(sessionId: string, updates: any) {
    try {
      const result = await client.models.ZenithSession.update({
        id: sessionId,
        lastUpdated: Math.floor(Date.now() / 1000),
        ...updates,
      });
      return result.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },
};
