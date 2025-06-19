'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, Building2, Star, ChevronDown, X } from 'lucide-react';
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
  onSelectProblem
}) => {
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
    companies: [],
    minFrequency: 0,
    searchTerm: ''
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'frequency' | 'companies'>('title');

  // Get all unique companies with their total frequencies
  const allCompanies = useMemo(() => {
    const companyMap = new Map<string, { name: string; totalFrequency: number; problemCount: number }>();
    
    problems.forEach(problem => {
      problem.companies?.forEach(company => {
        const existing = companyMap.get(company.slug);
        if (existing) {
          existing.totalFrequency += company.frequency;
          existing.problemCount += 1;
        } else {
          companyMap.set(company.slug, {
            name: company.name,
            totalFrequency: company.frequency,
            problemCount: 1
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
    let filtered = problems.filter(problem => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(searchLower);
        const matchesDescription = problem.description.toLowerCase().includes(searchLower);
        const matchesCompany = problem.companies?.some(c => 
          c.name.toLowerCase().includes(searchLower)
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
        const problemCompanies = problem.companies?.map(c => c.slug) || [];
        if (!filters.companies.some(company => problemCompanies.includes(company))) {
          return false;
        }
      }

      // Minimum frequency filter
      if (filters.minFrequency > 0) {
        const maxFrequency = Math.max(...(problem.companies?.map(c => c.frequency) || [0]));
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
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        
        case 'frequency':
          const aMaxFreq = Math.max(...(a.companies?.map(c => c.frequency) || [0]));
          const bMaxFreq = Math.max(...(b.companies?.map(c => c.frequency) || [0]));
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
      case 'Easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTopCompanies = (companies: Company[], limit = 3) => {
    return companies
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      companies: [],
      minFrequency: 0,
      searchTerm: ''
    });
  };

  const removeFilter = (type: keyof FilterState, value: string | number) => {
    setFilters(prev => {
      if (type === 'difficulty' || type === 'companies') {
        return {
          ...prev,
          [type]: prev[type].filter(item => item !== value)
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Problems ({filteredProblems.length})</h3>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search problems, companies, or keywords..."
          value={filters.searchTerm}
          onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          {/* Sort and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">Title (A-Z)</option>
                <option value="difficulty">Difficulty</option>
                <option value="frequency">Max Frequency</option>
                <option value="companies">Company Count</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => {
                      const isSelected = filters.difficulty.includes(diff);
                      setFilters(prev => ({
                        ...prev,
                        difficulty: isSelected 
                          ? prev.difficulty.filter(d => d !== diff)
                          : [...prev.difficulty, diff]
                      }));
                    }}
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                      filters.difficulty.includes(diff)
                        ? getDifficultyColor(diff)
                        : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top Companies ({allCompanies.length})
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {allCompanies.slice(0, 20).map(company => (
                <button
                  key={company.slug}
                  onClick={() => {
                    const isSelected = filters.companies.includes(company.slug);
                    setFilters(prev => ({
                      ...prev,
                      companies: isSelected 
                        ? prev.companies.filter(c => c !== company.slug)
                        : [...prev.companies, company.slug]
                    }));
                  }}
                  className={`p-2 text-xs rounded-md border text-left transition-colors ${
                    filters.companies.includes(company.slug)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CompanyLogo 
                      companySlug={company.slug} 
                      companyName={company.name}
                      size={20}
                    />
                    <span className="font-medium truncate">{company.name}</span>
                  </div>
                  <div className="text-xs opacity-75 ml-6">
                    {company.problemCount} problems, {company.totalFrequency} freq
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Frequency: {filters.minFrequency}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minFrequency}
              onChange={(e) => setFilters(prev => ({ ...prev, minFrequency: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters */}
      {(filters.difficulty.length > 0 || filters.companies.length > 0 || filters.minFrequency > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.difficulty.map(diff => (
            <span key={diff} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
              {diff}
              <button onClick={() => removeFilter('difficulty', diff)}>
                <X size={12} />
              </button>
            </span>
          ))}
          {filters.companies.map(companySlug => {
            const company = allCompanies.find(c => c.slug === companySlug);
            return (
              <span key={companySlug} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                {company?.name}
                <button onClick={() => removeFilter('companies', companySlug)}>
                  <X size={12} />
                </button>
              </span>
            );
          })}
          {filters.minFrequency > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
              Min Freq: {filters.minFrequency}
              <button onClick={() => setFilters(prev => ({ ...prev, minFrequency: 0 }))}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Problem List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No problems found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          filteredProblems.map(problem => {
            const isSelected = selectedProblem?.id === problem.id;
            const topCompanies = getTopCompanies(problem.companies || []);
            const maxFrequency = Math.max(...(problem.companies?.map(c => c.frequency) || [0]));

            return (
              <div
                key={problem.id}
                onClick={() => onSelectProblem(problem)}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Problem Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{problem.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-md border ${getDifficultyColor(problem.difficulty)}`}>
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
                      {topCompanies.map(company => (
                        <div
                          key={company.slug}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md border"
                        >
                          <CompanyLogo 
                            companySlug={company.slug} 
                            companyName={company.name}
                            size={16}
                            variant="circle"
                          />
                          <span className="font-medium">{company.name}</span>
                          <span className="text-gray-500">({company.frequency})</span>
                        </div>
                      ))}
                      {problem.companies && problem.companies.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">
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