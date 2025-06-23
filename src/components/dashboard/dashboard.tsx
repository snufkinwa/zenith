// src/components/dashboard/dashboard.tsx
import React, { useState, useEffect } from 'react';
import ActivityHeatmap from './ActivityHeatMap';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import {
  BookOpen,
  Target,
  Calendar,
  Code,
  TrendingUp,
  Clock,
} from 'lucide-react';

const client = generateClient<Schema>();

interface UserProfile {
  full_name: string;
  easy: number;
  medium: number;
  hard: number;
  streak?: number;
  total_study_time?: number; // in minutes
  topics_studied?: string[];
}

const Dashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Get current user from Amplify Auth
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Try to get profile from your Profile model
      const { data: profiles } = await client.models.Profile.list({
        filter: { userId: { eq: currentUser.userId } },
      });

      let profile: UserProfile;

      if (profiles.length > 0) {
        // Use data from Profile model
        const userProfileData = profiles[0];

        // Get solved problems count from ZenithSessions
        const { data: sessions } = await client.models.ZenithSession.list({
          filter: {
            userId: { eq: currentUser.userId },
            status: { eq: 'completed' }, // or however you track completed problems
          },
        });

        // Count problems by difficulty (you'll need to enhance this based on your problem data)
        const easyCount = sessions.filter((s) => s.mode === 'easy').length;
        const mediumCount = sessions.filter((s) => s.mode === 'medium').length;
        const hardCount = sessions.filter((s) => s.mode === 'hard').length;

        profile = {
          full_name:
            userProfileData.fullName ||
            userProfileData.username ||
            'Anonymous Learner',
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
          streak: 7, // TODO: Calculate actual streak from sessions
          total_study_time: 180, // TODO: Sum from sessions
          topics_studied: ['Arrays', 'Strings', 'Binary Trees'], // TODO: Extract from sessions
        };
      } else {
        // Create default profile if none exists
        profile = {
          full_name: currentUser.signInDetails?.loginId || 'Anonymous Learner',
          easy: 0,
          medium: 0,
          hard: 0,
          streak: 0,
          total_study_time: 0,
          topics_studied: [],
        };

        // Optionally create the profile in the database
        try {
          await client.models.Profile.create({
            userId: currentUser.userId,
            fullName: profile.full_name,
            email: currentUser.signInDetails?.loginId || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (createError) {
          console.warn('Could not create profile:', createError);
        }
      }

      setUserProfile(profile);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            {error || 'Failed to load profile'}
          </p>
          <button
            onClick={fetchUserProfile}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalSolved = userProfile.easy + userProfile.medium + userProfile.hard;
  const studyHours = Math.floor((userProfile.total_study_time || 0) / 60);
  const studyMinutes = (userProfile.total_study_time || 0) % 60;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl space-y-6">
          {/* Welcome Header */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile.full_name}! 👋
                </h1>
                <p className="mt-1 text-gray-600">
                  Ready to tackle some coding challenges?
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Streak</div>
                <div className="text-2xl font-bold text-orange-600">
                  {userProfile.streak || 0} days 🔥
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Solved */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-2">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Solved
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSolved}
                  </p>
                </div>
              </div>
            </div>

            {/* Easy Problems */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Easy</p>
                  <p className="text-2xl font-bold text-green-600">
                    {userProfile.easy}
                  </p>
                </div>
              </div>
            </div>

            {/* Medium Problems */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-2">
                  <Code className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medium</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {userProfile.medium}
                  </p>
                </div>
              </div>
            </div>

            {/* Hard Problems */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-100 p-2">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hard</p>
                  <p className="text-2xl font-bold text-red-600">
                    {userProfile.hard}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Activity This Year
            </h2>
            <ActivityHeatmap userId={user?.userId} />
          </div>

          {/* Recent Activity & Study Time */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Study Time */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Study Time
                </h2>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {studyHours}h {studyMinutes}m
                </div>
                <p className="mt-1 text-gray-500">Total time spent coding</p>
              </div>
            </div>

            {/* Topics Studied */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Topics Studied
                </h2>
              </div>
              <div className="space-y-2">
                {userProfile.topics_studied?.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-gray-50 p-2"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {topic}
                    </span>
                    <span className="text-xs text-gray-500">Recently</span>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No topics studied yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
