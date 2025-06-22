'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  Building2,
  Star,
  ChevronDown,
  X,
} from 'lucide-react';
import CompanyLogo from '@/components/ui/CompanyLogo';

interface Company {
  name: string;
  slug: string;
  frequency: number;
}

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
  companies?: Company[];
  note?: string | null;
  follow_up?: string;
  isCustom?: boolean;
  source?: string;
  createdAt?: string;
}

interface EnhancedProblemListProps {
  problems: Problem[];
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
}

interface FilterState {
  difficulty: string[];
  companies: string[];
  minFrequency: number;
  searchTerm: string;
}

const ProblemList: React.FC<EnhancedProblemListProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
    companies: [],
    minFrequency: 0,
    searchTerm: '',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    'title' | 'difficulty' | 'frequency' | 'companies'
  >('title');

  // Get all unique companies with their total frequencies
  const allCompanies = useMemo(() => {
    const companyMap = new Map<
      string,
      { name: string; totalFrequency: number; problemCount: number }
    >();

    problems.forEach((problem) => {
      problem.companies?.forEach((company) => {
        const existing = companyMap.get(company.slug);
        if (existing) {
          existing.totalFrequency += company.frequency;
          existing.problemCount += 1;
        } else {
          companyMap.set(company.slug, {
            name: company.name,
            totalFrequency: company.frequency,
            problemCount: 1,
          });
        }
      });
    });

    return Array.from(companyMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.totalFrequency - a.totalFrequency);
  }, [problems]);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let filtered = problems.filter((problem) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(searchLower);
        const matchesDescription = problem.description
          .toLowerCase()
          .includes(searchLower);
        const matchesCompany = problem.companies?.some((c) =>
          c.name.toLowerCase().includes(searchLower),
        );

        if (!matchesTitle && !matchesDescription && !matchesCompany) {
          return false;
        }
      }

      // Difficulty filter
      if (filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(problem.difficulty)) {
          return false;
        }
      }

      // Company filter
      if (filters.companies.length > 0) {
        const problemCompanies = problem.companies?.map((c) => c.slug) || [];
        if (
          !filters.companies.some((company) =>
            problemCompanies.includes(company),
          )
        ) {
          return false;
        }
      }

      // Minimum frequency filter
      if (filters.minFrequency > 0) {
        const maxFrequency = Math.max(
          ...(problem.companies?.map((c) => c.frequency) || [0]),
        );
        if (maxFrequency < filters.minFrequency) {
          return false;
        }
      }

      return true;
    });

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return (
            difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
            difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
          );

        case 'frequency':
          const aMaxFreq = Math.max(
            ...(a.companies?.map((c) => c.frequency) || [0]),
          );
          const bMaxFreq = Math.max(
            ...(b.companies?.map((c) => c.frequency) || [0]),
          );
          return bMaxFreq - aMaxFreq;

        case 'companies':
          const aCompanyCount = a.companies?.length || 0;
          const bCompanyCount = b.companies?.length || 0;
          return bCompanyCount - aCompanyCount;

        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [problems, filters, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTopCompanies = (companies: Company[], limit = 3) => {
    return companies.sort((a, b) => b.frequency - a.frequency).slice(0, limit);
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      companies: [],
      minFrequency: 0,
      searchTerm: '',
    });
  };

  const removeFilter = (type: keyof FilterState, value: string | number) => {
    setFilters((prev) => {
      if (type === 'difficulty' || type === 'companies') {
        return {
          ...prev,
          [type]: prev[type].filter((item) => item !== value),
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Problems ({filteredProblems.length})
        </h3>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm transition-colors hover:bg-gray-200"
        >
          <Filter size={14} />
          Filters
          <ChevronDown
            size={14}
            className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search problems, companies, or keywords..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          {/* Sort and Difficulty */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Sort By */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">Title (A-Z)</option>
                <option value="difficulty">Difficulty</option>
                <option value="frequency">Max Frequency</option>
                <option value="companies">Company Count</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      const isSelected = filters.difficulty.includes(diff);
                      setFilters((prev) => ({
                        ...prev,
                        difficulty: isSelected
                          ? prev.difficulty.filter((d) => d !== diff)
                          : [...prev.difficulty, diff],
                      }));
                    }}
                    className={`rounded-md border px-3 py-1 text-xs transition-colors ${
                      filters.difficulty.includes(diff)
                        ? getDifficultyColor(diff)
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Company Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Top Companies ({allCompanies.length})
            </label>
            <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3">
              {allCompanies.slice(0, 20).map((company) => (
                <button
                  key={company.slug}
                  onClick={() => {
                    const isSelected = filters.companies.includes(company.slug);
                    setFilters((prev) => ({
                      ...prev,
                      companies: isSelected
                        ? prev.companies.filter((c) => c !== company.slug)
                        : [...prev.companies, company.slug],
                    }));
                  }}
                  className={`rounded-md border p-2 text-left text-xs transition-colors ${
                    filters.companies.includes(company.slug)
                      ? 'border-blue-200 bg-blue-100 text-blue-800'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <CompanyLogo
                      companySlug={company.slug}
                      companyName={company.name}
                      size={20}
                    />
                    <span className="truncate font-medium">{company.name}</span>
                  </div>
                  <div className="ml-6 text-xs opacity-75">
                    {company.problemCount} problems, {company.totalFrequency}{' '}
                    freq
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Minimum Frequency: {filters.minFrequency}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minFrequency}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minFrequency: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full rounded-md bg-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-300"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters */}
      {(filters.difficulty.length > 0 ||
        filters.companies.length > 0 ||
        filters.minFrequency > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.difficulty.map((diff) => (
            <span
              key={diff}
              className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-800"
            >
              {diff}
              <button onClick={() => removeFilter('difficulty', diff)}>
                <X size={12} />
              </button>
            </span>
          ))}
          {filters.companies.map((companySlug) => {
            const company = allCompanies.find((c) => c.slug === companySlug);
            return (
              <span
                key={companySlug}
                className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs text-green-800"
              >
                {company?.name}
                <button onClick={() => removeFilter('companies', companySlug)}>
                  <X size={12} />
                </button>
              </span>
            );
          })}
          {filters.minFrequency > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-1 text-xs text-purple-800">
              Min Freq: {filters.minFrequency}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, minFrequency: 0 }))
                }
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Problem List */}
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {filteredProblems.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Filter className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="font-medium">No problems found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          filteredProblems.map((problem) => {
            const isSelected = selectedProblem?.id === problem.id;
            const topCompanies = getTopCompanies(problem.companies || []);
            const maxFrequency = Math.max(
              ...(problem.companies?.map((c) => c.frequency) || [0]),
            );

            return (
              <div
                key={problem.id}
                onClick={() => onSelectProblem(problem)}
                className={`cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Problem Header */}
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1 font-medium text-gray-900">
                      {problem.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-xs ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                      {maxFrequency > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <TrendingUp size={12} />
                          {maxFrequency}
                        </span>
                      )}
                      {problem.companies && problem.companies.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Building2 size={12} />
                          {problem.companies.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Companies */}
                {topCompanies.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {topCompanies.map((company) => (
                        <div
                          key={company.slug}
                          className="inline-flex items-center gap-1.5 rounded-md border bg-gray-50 px-2 py-1 text-xs text-gray-700"
                        >
                          <CompanyLogo
                            companySlug={company.slug}
                            companyName={company.name}
                            size={16}
                            variant="circle"
                          />
                          <span className="font-medium">{company.name}</span>
                          <span className="text-gray-500">
                            ({company.frequency})
                          </span>
                        </div>
                      ))}
                      {problem.companies && problem.companies.length > 3 && (
                        <span className="self-center text-xs text-gray-500">
                          +{problem.companies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProblemList;
