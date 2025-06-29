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
  Building2,
  TrendingUp,
  User,
  Calendar,
} from 'lucide-react';
import problemsData from '@public/data/problems.json';
import { getCustomProblems } from '@/utils/customProblems';
import CompanyLogo from '@/components/ui/CompanyLogo';

interface Company {
  name: string;
  slug: string;
  frequency: number;
}

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  companies?: Company[];
  note?: string | null;
  follow_up?: string;
  isCustom?: boolean;
  source?: string;
  createdAt?: string;
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
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [minFrequency, setMinFrequency] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load problems and user progress
    const loadData = async () => {
      try {
        // Load default problems
        const defaultProblems = problemsData as unknown as Problem[];

        // Load custom problems
        const customProblems = getCustomProblems().map((cp) => ({
          ...cp,
          companies: cp.companies || [],
        }));

        // Combine all problems
        const allProblems = [...defaultProblems, ...customProblems];
        setProblems(allProblems);

        // Load user progress from localStorage
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

  // Get all unique companies
  const allCompanies = useMemo(() => {
    const companyMap = new Map<
      string,
      { name: string; count: number; totalFreq: number }
    >();

    problems.forEach((problem) => {
      problem.companies?.forEach((company) => {
        const existing = companyMap.get(company.slug);
        if (existing) {
          existing.count += 1;
          existing.totalFreq += company.frequency;
        } else {
          companyMap.set(company.slug, {
            name: company.name,
            count: 1,
            totalFreq: company.frequency,
          });
        }
      });
    });

    return Array.from(companyMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.totalFreq - a.totalFreq);
  }, [problems]);

  // Get all unique sources
  const allSources = useMemo(() => {
    const sources = new Set<string>();
    problems.forEach((problem) => {
      if (problem.isCustom) {
        sources.add(problem.source || 'Custom');
      } else {
        sources.add('LeetCode');
      }
    });
    return Array.from(sources).sort();
  }, [problems]);

  // Filter problems based on all criteria
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.companies?.some((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Difficulty filter
      const matchesDifficulty =
        difficultyFilter === 'all' ||
        problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();

      // Status filter
      const status = problemStatus[problem.id] || 'not_started';
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && status === 'completed') ||
        (statusFilter === 'attempted' && status === 'attempted') ||
        (statusFilter === 'not_started' && status === 'not_started');

      // Company filter
      const matchesCompany =
        companyFilter === 'all' ||
        problem.companies?.some((c) => c.slug === companyFilter);

      // Source filter
      const problemSource = problem.isCustom
        ? problem.source || 'Custom'
        : 'LeetCode';
      const matchesSource =
        sourceFilter === 'all' || problemSource === sourceFilter;

      // Frequency filter
      const maxFreq = Math.max(
        ...(problem.companies?.map((c) => c.frequency) || [0]),
      );
      const matchesFrequency = minFrequency === 0 || maxFreq >= minFrequency;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesStatus &&
        matchesCompany &&
        matchesSource &&
        matchesFrequency
      );
    });
  }, [
    problems,
    searchQuery,
    difficultyFilter,
    statusFilter,
    companyFilter,
    sourceFilter,
    minFrequency,
    problemStatus,
  ]);

  const getDifficultyConfig = (difficulty: string) => {
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

  const getTopCompanies = (companies: Company[], limit = 3) => {
    return companies.sort((a, b) => b.frequency - a.frequency).slice(0, limit);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setStatusFilter('all');
    setCompanyFilter('all');
    setSourceFilter('all');
    setMinFrequency(0);
  };

  const stats = useMemo(() => {
    const completed = Object.values(problemStatus).filter(
      (status) => status === 'completed',
    ).length;
    const attempted = Object.values(problemStatus).filter(
      (status) => status === 'attempted',
    ).length;
    const total = problems.length;
    const customCount = problems.filter((p) => p.isCustom).length;

    return { completed, attempted, total, customCount };
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
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <span>{stats.customCount} Custom</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>{allCompanies.length} Companies</span>
            </div>
            <div className="text-gray-500">Total: {stats.total} problems</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          {/* Basic Filters */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems or companies..."
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company
              </label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Companies</option>
                {allCompanies.slice(0, 20).map((company) => (
                  <option key={company.slug} value={company.slug}>
                    {company.name} ({company.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Advanced
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Source
                </label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sources</option>
                  {allSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Min Frequency: {minFrequency}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minFrequency}
                  onChange={(e) => setMinFrequency(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
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
                const topCompanies = getTopCompanies(problem.companies || []);
                const maxFrequency = Math.max(
                  ...(problem.companies?.map((c) => c.frequency) || [0]),
                );

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

                        {/* Problem Info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Link
                              href={`/beta?problem=${problem.slug}`}
                              className="truncate font-medium text-blue-600 hover:text-blue-800"
                            >
                              {problem.title}
                            </Link>
                            {problem.isCustom && (
                              <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                                <User size={10} />
                                {problem.source || 'Custom'}
                              </span>
                            )}
                          </div>

                          {/* Companies */}
                          {topCompanies.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {topCompanies.map((company) => (
                                <div
                                  key={company.slug}
                                  className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                                >
                                  <CompanyLogo
                                    companySlug={company.slug}
                                    companyName={company.name}
                                    size={12}
                                    variant="circle"
                                  />
                                  <span>{company.name}</span>
                                  <span className="text-gray-500">
                                    ({company.frequency})
                                  </span>
                                </div>
                              ))}
                              {problem.companies &&
                                problem.companies.length > 3 && (
                                  <span className="self-center text-xs text-gray-500">
                                    +{problem.companies.length - 3} more
                                  </span>
                                )}
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {maxFrequency > 0 && (
                            <div className="flex items-center gap-1">
                              <TrendingUp size={12} />
                              <span>{maxFrequency}</span>
                            </div>
                          )}
                          {problem.companies &&
                            problem.companies.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Building2 size={12} />
                                <span>{problem.companies.length}</span>
                              </div>
                            )}
                          {problem.isCustom && problem.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>
                                {new Date(
                                  problem.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
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
                            href={`/beta?problem=${problem.slug}`}
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
