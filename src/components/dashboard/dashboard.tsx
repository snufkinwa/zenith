import React, { useState, useEffect } from 'react';
import ActivityHeatmap from './ActivityHeatMap';
import { createClient } from '../../utils/supabase/supabaseClient';
import { 
  BookOpen, 
  Target,
  Calendar,
  Code,
  TrendingUp,
  Clock
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
      const { data: { user } } = await supabase.auth.getUser();
      
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
        topics_studied: []
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <button 
            onClick={fetchUserProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
    <div className="h-full bg-gray-50 overflow-hidden flex flex-col">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userProfile.full_name}!</h1>
                <p className="text-gray-600 mt-1">Continue your DSA learning journey</p>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                  <p className="text-3xl font-bold text-gray-900">{totalSolved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Streak</p>
                  <p className="text-3xl font-bold text-gray-900">{userProfile.streak || 0}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Time</p>
                  <p className="text-3xl font-bold text-gray-900">{studyHours}h</p>
                  {studyMinutes > 0 && <p className="text-sm text-gray-500">{studyMinutes}m</p>}
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Topics Learned</p>
                  <p className="text-3xl font-bold text-gray-900">{userProfile.topics_studied?.length || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Difficulty Progress */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">Easy Problems</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{userProfile.easy}</div>
                      <div className="text-sm text-gray-500">Great for building fundamentals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">Medium Problems</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-600">{userProfile.medium}</div>
                      <div className="text-sm text-gray-500">Interview-level questions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">Hard Problems</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{userProfile.hard}</div>
                      <div className="text-sm text-gray-500">Advanced challenges</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Study Activity</h3>
                    <p className="text-sm text-gray-600 mt-1">Your consistent learning journey</p>
                  </div>
                  {userProfile.streak && userProfile.streak > 0 && (
                    <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-full">
                      <div className="text-orange-500">🔥</div>
                      <span className="text-sm font-semibold text-orange-700">{userProfile.streak} day streak</span>
                    </div>
                  )}
                </div>
                <div className="h-48 bg-gray-50 rounded-lg p-4">
                  <ActivityHeatmap />
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Learning Goals */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Solve 1 problem</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Study for 30 minutes</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Learn a new concept</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="text-sm font-medium text-blue-900">Continue Learning</div>
                    <div className="text-xs text-blue-600">Pick up where you left off</div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="text-sm font-medium text-green-900">Practice Problems</div>
                    <div className="text-xs text-green-600">Solve problems by topic</div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="text-sm font-medium text-purple-900">Review Notes</div>
                    <div className="text-xs text-purple-600">Check your highlights</div>
                  </button>
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Tip</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Consistency beats intensity.</strong> Solving one problem daily is better than cramming 10 problems once a week.
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