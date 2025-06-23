'use client';
import { useCallback, useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import Avatar from '@/components/profile/avatar';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export default function AccountForm() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const { data } = await client.models.Profile.list({
        filter: { userId: { eq: currentUser.userId } },
      });

      if (data.length > 0) {
        const profileData = data[0];
        setProfile(profileData);
        setFullName(profileData.fullName || '');
        setUsername(profileData.username || '');
        setAvatarUrl(profileData.avatarUrl || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  async function updateProfile() {
    try {
      setLoading(true);

      if (profile) {
        // Update existing profile
        await client.models.Profile.update({
          id: profile.id,
          fullName,
          username,
          avatarUrl,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new profile
        const newProfile = await client.models.Profile.create({
          userId: user.userId,
          fullName,
          username,
          avatarUrl,
          email: user.signInDetails?.loginId || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setProfile(newProfile.data);
      }

      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile!');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  if (loading && !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-widget">
      <Avatar
        uid={user?.userId ?? null}
        url={avatarUrl}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile();
        }}
      />

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={user?.signInDetails?.loginId || ''}
          disabled
        />
      </div>

      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
