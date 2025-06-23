'use client';

import React, { useEffect, useState } from 'react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import Image from 'next/image';

// Define your DynamoDB table schema types
interface UserProfile {
  id: string;
  userId: string;
  avatarPath?: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize Amplify Data client with schema
const client = generateClient<Schema>();

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url && uid) {
      downloadImage(url);
    }
  }, [url, uid]);

  // Download image from S3
  const downloadImage = async (path: string) => {
    try {
      setLoading(true);
      const linkToStorageFile = await getUrl({
        path: `avatars/${path}`,
        options: {
          validateObjectExistence: true,
          expiresIn: 3600, // 1 hour
        },
      });

      if (linkToStorageFile.url) {
        setAvatarUrl(linkToStorageFile.url.toString());
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      setAvatarUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar to S3 and update DynamoDB
  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!uid) {
        throw new Error('User ID is required for upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Remove old avatar if exists
      if (url) {
        try {
          await remove({
            path: `avatars/${url}`,
          });
        } catch (error) {
          console.warn('Could not remove old avatar:', error);
        }
      }

      // Upload new file to S3
      const result = await uploadData({
        path: filePath,
        data: file,
        options: {
          contentType: file.type,
          contentDisposition: 'inline',
        },
      });

      await result.result;

      // Update user profile in DynamoDB
      await updateUserProfile(uid, fileName);

      // Get the new URL
      const newUrl = await getUrl({
        path: filePath,
        options: {
          validateObjectExistence: true,
          expiresIn: 3600,
        },
      });

      if (newUrl.url) {
        setAvatarUrl(newUrl.url.toString());
        onUpload(fileName); // Pass back the filename, not the full URL
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar! Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Update user profile in DynamoDB
  const updateUserProfile = async (userId: string, avatarPath: string) => {
    try {
      const { data: existingProfile } = await client.models.Profile.list({
        filter: { userId: { eq: userId } },
      });

      if (existingProfile && existingProfile.length > 0) {
        // Update existing profile
        await client.models.Profile.update({
          id: existingProfile[0].id,
          avatarUrl: avatarPath,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new profile
        await client.models.Profile.create({
          userId,
          avatarUrl: avatarPath,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  return (
    <div className="avatar-container">
      <div className="avatar-display">
        {loading ? (
          <div className="avatar loading" style={{ height: size, width: size }}>
            <div className="loading-spinner">Loading...</div>
          </div>
        ) : avatarUrl ? (
          <Image
            width={size}
            height={size}
            src={avatarUrl}
            alt="Avatar"
            className="avatar image"
            style={{ height: size, width: size }}
            onError={() => setAvatarUrl(null)}
          />
        ) : (
          <div
            className="avatar no-image"
            style={{ height: size, width: size }}
          >
            <div className="avatar-placeholder">
              <svg
                width={size * 0.6}
                height={size * 0.6}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="avatar-upload" style={{ width: size }}>
        <label
          className="button primary block"
          htmlFor="avatar-upload"
          style={{
            pointerEvents: uploading ? 'none' : 'auto',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Avatar'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading || !uid}
        />
      </div>

      <style jsx>{`
        .avatar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .avatar-display {
          position: relative;
        }

        .avatar {
          border-radius: 50%;
          object-fit: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e5e7eb;
        }

        .avatar.no-image {
          background-color: #f3f4f6;
          color: #9ca3af;
        }

        .avatar.loading {
          background-color: #f3f4f6;
          color: #6b7280;
        }

        .avatar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner {
          font-size: 12px;
          color: #6b7280;
        }

        .button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-align: center;
          font-weight: 500;
          transition: all 0.2s;
          width: 100%;
        }

        .button.primary {
          background-color: #3b82f6;
          color: white;
        }

        .button.primary:hover {
          background-color: #2563eb;
        }

        .button.primary:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .block {
          display: block;
        }
      `}</style>
    </div>
  );
}
