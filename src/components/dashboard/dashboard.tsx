import React, { useState, useEffect } from 'react';
import ActivityHeatmap from './ActivityHeatMap';
import { createClient } from '../../utils/supabase/supabaseClient';
import {
  BookOpen,
  Target,
  Calendar,
  Code,
  TrendingUp,
  Clock,
} from 'lucide-react';

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Simple profile structure - replace with actual Supabase query when ready
      const profile: UserProfile = {
        full_name: user.user_metadata?.full_name || 'Anonymous Learner',
        easy: 0,
        medium: 0,
        hard: 0,
        streak: 0,
        total_study_time: 0,
        topics_studied: [],
      };

      setUserProfile(profile);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
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
            <div className="flex items-center space-x-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                {userProfile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile.full_name}!
                </h1>
                <p className="mt-1 text-gray-600">
                  Continue your DSA learning journey
                </p>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Problems Solved
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalSolved}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Study Streak
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {userProfile.streak || 0}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Study Time
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {studyHours}h
                  </p>
                  {studyMinutes > 0 && (
                    <p className="text-sm text-gray-500">{studyMinutes}m</p>
                  )}
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Topics Learned
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {userProfile.topics_studied?.length || 0}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Learning Progress */}
            <div className="space-y-6 lg:col-span-2">
              {/* Difficulty Progress */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">
                  Learning Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 rounded-full bg-green-600"></div>
                      <span className="font-medium text-gray-900">
                        Easy Problems
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {userProfile.easy}
                      </div>
                      <div className="text-sm text-gray-500">
                        Great for building fundamentals
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 rounded-full bg-yellow-600"></div>
                      <span className="font-medium text-gray-900">
                        Medium Problems
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-600">
                        {userProfile.medium}
                      </div>
                      <div className="text-sm text-gray-500">
                        Interview-level questions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 rounded-full bg-red-600"></div>
                      <span className="font-medium text-gray-900">
                        Hard Problems
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {userProfile.hard}
                      </div>
                      <div className="text-sm text-gray-500">
                        Advanced challenges
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Study Activity
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Your consistent learning journey
                    </p>
                  </div>
                  {userProfile.streak && userProfile.streak > 0 && (
                    <div className="flex items-center space-x-2 rounded-full bg-orange-50 px-3 py-2">
                      <div className="text-orange-500">🔥</div>
                      <span className="text-sm font-semibold text-orange-700">
                        {userProfile.streak} day streak
                      </span>
                    </div>
                  )}
                </div>
                <div className="h-48 rounded-lg bg-gray-50 p-4">
                  <ActivityHeatmap />
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Learning Goals */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Today&lsquo;s Goals
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Solve 1 problem
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg bg-green-50 p-3">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Study for 30 minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg bg-purple-50 p-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-gray-700">
                      Learn a new concept
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full rounded-lg bg-blue-50 p-3 text-left transition-colors hover:bg-blue-100">
                    <div className="text-sm font-medium text-blue-900">
                      Continue Learning
                    </div>
                    <div className="text-xs text-blue-600">
                      Pick up where you left off
                    </div>
                  </button>

                  <button className="w-full rounded-lg bg-green-50 p-3 text-left transition-colors hover:bg-green-100">
                    <div className="text-sm font-medium text-green-900">
                      Practice Problems
                    </div>
                    <div className="text-xs text-green-600">
                      Solve problems by topic
                    </div>
                  </button>

                  <button className="w-full rounded-lg bg-purple-50 p-3 text-left transition-colors hover:bg-purple-100">
                    <div className="text-sm font-medium text-purple-900">
                      Review Notes
                    </div>
                    <div className="text-xs text-purple-600">
                      Check your highlights
                    </div>
                  </button>
                </div>
              </div>

              {/* Study Tips */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Study Tip
                </h3>
                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Consistency beats intensity.</strong> Solving one
                    problem daily is better than cramming 10 problems once a
                    week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
