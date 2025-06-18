"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, Star, Zap, ArrowRight } from 'lucide-react';

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  note?: string | null;
  follow_up?: string;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/problems.json');
        const problemsData = await response.json();
        setProblems(problemsData);
      } catch (error) {
        console.error('Error loading problems:', error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter problems based on search and difficulty
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesSearch = !searchQuery || 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === "all" || 
        problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
      
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, searchQuery, difficultyFilter]);

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return {
          icon: <Zap className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800'
        };
      case 'medium':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'hard':
        return {
          icon: <Star className="w-4 h-4" />,
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
          <p className="text-gray-600">Solve coding problems to improve your skills</p>
          
          {/* Simple Stats */}
          <div className="mt-4 text-sm text-gray-500">
            Total: {problems.length} problems
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter("all");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No problems found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              filteredProblems.map((problem, index) => {
                const difficultyConfig = getDifficultyConfig(problem.difficulty);
                
                return (
                  <div
                    key={problem.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Problem Number */}
                        <div className="flex-shrink-0 w-12 text-gray-500 text-sm font-medium">
                          #{index + 1}
                        </div>

                        {/* Problem Title */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/beta?problem=${problem.slug}`}
                            className="text-blue-600 hover:text-blue-800 font-medium truncate block"
                          >
                            {problem.title}
                          </Link>
                        </div>

                        {/* Difficulty Badge */}
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig.color}`}>
                            {difficultyConfig.icon}
                            {problem.difficulty}
                          </span>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Link
                            href={`/beta?problem=${problem.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            Solve
                            <ArrowRight className="w-4 h-4" />
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