// utils/magicLink.ts
import { nanoid } from 'nanoid';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export class MagicLinkService {
  // Create magic link with database storage
  static async createMagicLink(
    type: 'collab' | 'solution' | 'discussion',
    data: any,
  ): Promise<string> {
    try {
      const linkId = nanoid(12);
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const currentUser = await getCurrentUser();

      const linkData = {
        linkId,
        type,
        data,
        createdBy: currentUser.userId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        isActive: true,
        usedBy: [],
      };

      // Save to DynamoDB
      await client.models.MagicLink.create(linkData);

      return `${baseUrl}/join/${linkId}`;
    } catch (error) {
      console.error('Error creating magic link:', error);
      throw new Error('Failed to create magic link');
    }
  }

  // Get magic link data
  static async getMagicLink(linkId: string) {
    try {
      const { data } = await client.models.MagicLink.get({ linkId });

      if (!data) {
        throw new Error('Magic link not found');
      }

      // Check if expired
      if (new Date() > new Date(data.expiresAt) || !data.isActive) {
        throw new Error('Magic link has expired');
      }

      return data;
    } catch (error) {
      console.error('Error getting magic link:', error);
      throw error;
    }
  }

  // Use magic link (track usage)
  static async useMagicLink(linkId: string) {
    try {
      const currentUser = await getCurrentUser();
      const linkData = await this.getMagicLink(linkId);

      // Add user to usedBy array if not already there
      const usedBy = linkData.usedBy || [];
      if (!usedBy.includes(currentUser.userId)) {
        usedBy.push(currentUser.userId);

        await client.models.MagicLink.update({
          linkId,
          usedBy,
        });
      }

      return linkData;
    } catch (error) {
      console.error('Error using magic link:', error);
      throw error;
    }
  }

  // Deactivate magic link
  static async deactivateMagicLink(linkId: string) {
    try {
      await client.models.MagicLink.update({
        linkId,
        isActive: false,
      });
    } catch (error) {
      console.error('Error deactivating magic link:', error);
      throw error;
    }
  }

  // Get user's created links
  static async getUserLinks(userId?: string) {
    try {
      const currentUser = userId || (await getCurrentUser()).userId;

      const { data } = await client.models.MagicLink.list({
        filter: {
          createdBy: { eq: currentUser },
          isActive: { eq: true },
        },
      });

      return data || [];
    } catch (error) {
      console.error('Error getting user links:', error);
      return [];
    }
  }
}
