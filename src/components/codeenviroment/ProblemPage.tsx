'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle,
  Circle,
  Clock,
  Star,
  Zap,
  ArrowRight,
} from 'lucide-react';
import problemsData from '../../../public/data/problems.json';

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string | null;
  content: string;
}

interface ProblemStatus {
  [key: string]: 'completed' | 'attempted' | 'not_started';
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemStatus, setProblemStatus] = useState<ProblemStatus>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load problems and user progress
    const loadData = async () => {
      try {
        setProblems(problemsData as unknown as Problem[]);

        // Load user progress from localStorage or API
        const savedProgress = localStorage.getItem('problemProgress');
        if (savedProgress) {
          setProblemStatus(JSON.parse(savedProgress));
        } else {
          // Mock some completed problems for demo
          const mockProgress: ProblemStatus = {
            '1': 'completed',
            '2': 'attempted',
            '4': 'completed',
            '7': 'attempted',
          };
          setProblemStatus(mockProgress);
          localStorage.setItem('problemProgress', JSON.stringify(mockProgress));
        }
      } catch (error) {
        console.error('Error loading problems:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter problems based on search, difficulty, and status
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        !searchQuery ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === 'all' ||
        problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();

      const status = problemStatus[problem.id] || 'not_started';
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && status === 'completed') ||
        (statusFilter === 'attempted' && status === 'attempted') ||
        (statusFilter === 'not_started' && status === 'not_started');

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [problems, searchQuery, difficultyFilter, statusFilter, problemStatus]);

  const getDifficultyConfig = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return {
          icon: <Zap className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800',
          textColor: 'text-green-600',
        };
      case 'medium':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-800',
          textColor: 'text-yellow-600',
        };
      case 'hard':
        return {
          icon: <Star className="h-4 w-4" />,
          color: 'bg-red-100 text-red-800',
          textColor: 'text-red-600',
        };
      default:
        return {
          icon: <Circle className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800',
          textColor: 'text-gray-600',
        };
    }
  };

  const getStatusIcon = (problemId: string) => {
    const status = problemStatus[problemId] || 'not_started';
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'attempted':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const stats = useMemo(() => {
    const completed = Object.values(problemStatus).filter(
      (status) => status === 'completed',
    ).length;
    const attempted = Object.values(problemStatus).filter(
      (status) => status === 'attempted',
    ).length;
    const total = problems.length;

    return { completed, attempted, total };
  }, [problemStatus, problems]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Problems</h1>
          <p className="text-gray-600">
            Solve coding problems to improve your skills
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{stats.completed} Solved</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>{stats.attempted} Attempted</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>
                {stats.total - stats.completed - stats.attempted} Not Started
              </span>
            </div>
            <div className="text-gray-500">Total: {stats.total} problems</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="attempted">Attempted</option>
                <option value="not_started">Not Started</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('all');
                  setStatusFilter('all');
                }}
                className="w-full rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="divide-y divide-gray-200">
            {filteredProblems.length === 0 ? (
              <div className="py-12 text-center">
                <Filter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-lg text-gray-500">No problems found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              filteredProblems.map((problem, index) => {
                const difficultyConfig = getDifficultyConfig(
                  problem.difficulty,
                );
                const status = problemStatus[problem.id] || 'not_started';

                return (
                  <div
                    key={problem.id}
                    className="p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center gap-4">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {getStatusIcon(problem.id)}
                        </div>

                        {/* Problem Number */}
                        <div className="w-12 flex-shrink-0 text-sm text-gray-500">
                          #{index + 1}
                        </div>

                        {/* Problem Title */}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/beta?problem=${problem.id}`}
                            className="block truncate font-medium text-blue-600 hover:text-blue-800"
                          >
                            {problem.title}
                          </Link>
                        </div>

                        {/* Difficulty Badge */}
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${difficultyConfig.color}`}
                          >
                            {difficultyConfig.icon}
                            {problem.difficulty}
                          </span>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Link
                            href={`/beta?problem=${problem.id}`}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                          >
                            {status === 'completed'
                              ? 'Review'
                              : status === 'attempted'
                                ? 'Continue'
                                : 'Solve'}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Results Info */}
        {filteredProblems.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredProblems.length} of {problems.length} problems
          </div>
        )}
      </div>
    </div>
  );
}
