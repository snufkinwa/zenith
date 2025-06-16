import React, { useState, useEffect } from 'react';
import ActivityHeatmap from './ActivityHeatMap';
import { createClient } from '../../utils/supabase/supabaseClient';
import { 
  Trophy, 
  MapPin, 
  Globe, 
  Linkedin, 
  Target,
  Calendar,
  Users,
  Code,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface UserProfile {
  full_name: string;
  rank: number;
  location: string;
  website: string;
  linkedin: string;
  easy: number;
  medium: number;
  hard: number;
  solved_problems?: Array<{ date: string; count: number }>;
  skills?: string[];
  recent_activity?: Array<{ date: string; problems_solved: number }>;
  streak?: number;
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

      // Mock data for demonstration - replace with actual Supabase query
      const mockProfile: UserProfile = {
        full_name: user.user_metadata?.full_name || 'Anonymous Coder',
        rank: 1337,
        location: 'San Francisco, CA',
        website: 'https://github.com/user',
        linkedin: 'https://linkedin.com/in/user',
        easy: 45,
        medium: 23,
        hard: 8,
        skills: ['Dynamic Programming', 'Arrays', 'Hash Tables', 'Binary Trees', 'Graphs'],
        streak: 15,
        recent_activity: [
          { date: '2024-01-15', problems_solved: 3 },
          { date: '2024-01-14', problems_solved: 2 },
          { date: '2024-01-13', problems_solved: 1 },
        ],
        solved_problems: [
          { date: '2024-01', count: 10 },
          { date: '2024-02', count: 15 },
          { date: '2024-03', count: 20 },
        ]
      };

      setUserProfile(mockProfile);
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
          <p className="text-gray-600">Loading your dashboard...</p>
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

  // Prepare pie chart data
  const pieChartData = [
    { name: 'Easy', value: userProfile.easy, color: '#10B981' },
    { name: 'Medium', value: userProfile.medium, color: '#F59E0B' },
    { name: 'Hard', value: userProfile.hard, color: '#EF4444' }
  ];

  return (
    <div className="h-full bg-gray-50 overflow-hidden flex flex-col">
      <div className="flex-1  p-2 lg:p-2">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg lg:text-2xl font-bold">
                  {userProfile.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{userProfile.full_name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>Rank #{userProfile.rank.toLocaleString()}</span>
                    </div>
                    {userProfile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {userProfile.website && (
                  <a 
                    href={userProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {userProfile.linkedin && (
                  <a 
                    href={userProfile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Problems Solved</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{totalSolved}</p>
                </div>
                <div className="p-2 lg:p-3 bg-green-100 rounded-full">
                  <Code className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{userProfile.streak}</p>
                </div>
                <div className="p-2 lg:p-3 bg-orange-100 rounded-full">
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Global Rank</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">#{userProfile.rank}</p>
                </div>
                <div className="p-2 lg:p-3 bg-purple-100 rounded-full">
                  <Users className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              {/* Problem Difficulty Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Problem Difficulty Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Problems']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">Easy</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{userProfile.easy}</div>
                        <div className="text-sm text-gray-500">{Math.round((userProfile.easy / totalSolved) * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">Medium</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">{userProfile.medium}</div>
                        <div className="text-sm text-gray-500">{Math.round((userProfile.medium / totalSolved) * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">Hard</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{userProfile.hard}</div>
                        <div className="text-sm text-gray-500">{Math.round((userProfile.hard / totalSolved) * 100)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Heatmap - CENTER OF ATTENTION */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Activity Heatmap</h3>
                    <p className="text-sm text-gray-600 mt-1">Your coding journey at a glance</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-full">
                    <div className="text-orange-500">🔥</div>
                    <span className="text-sm font-semibold text-orange-700">{userProfile.streak} day streak</span>
                  </div>
                </div>
                <div className="h-50 lg:h-60 bg-gray-50 rounded-lg p-4">
                  <ActivityHeatmap />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:space-y-6">
              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills?.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {userProfile.recent_activity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs lg:text-sm text-gray-600">{activity.date}</span>
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-gray-900">
                        {activity.problems_solved} problems
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Most Active Day</span>
                    <span className="text-sm font-medium text-gray-900">Monday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Best Month</span>
                    <span className="text-sm font-medium text-gray-900">March 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average per Day</span>
                    <span className="text-sm font-medium text-gray-900">2.3 problems</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Days Active</span>
                    <span className="text-sm font-medium text-gray-900">184 days</span>
                  </div>
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