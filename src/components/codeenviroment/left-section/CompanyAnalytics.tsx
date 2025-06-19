'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Building2, Star, Calendar } from 'lucide-react';
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
  companies?: Company[];
}

interface CompanyAnalyticsProps {
  problems: Problem[];
}

const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ problems }) => {
  const analytics = useMemo(() => {
    const companyStats = new Map<string, {
      name: string;
      totalFrequency: number;
      problemCount: number;
      difficulties: { Easy: number; Medium: number; Hard: number };
      avgFrequency: number;
    }>();

    problems.forEach(problem => {
      problem.companies?.forEach(company => {
        const existing = companyStats.get(company.slug);
        if (existing) {
          existing.totalFrequency += company.frequency;
          existing.problemCount += 1;
          existing.difficulties[problem.difficulty as keyof typeof existing.difficulties] += 1;
        } else {
          companyStats.set(company.slug, {
            name: company.name,
            totalFrequency: company.frequency,
            problemCount: 1,
            difficulties: { 
              Easy: problem.difficulty === 'Easy' ? 1 : 0,
              Medium: problem.difficulty === 'Medium' ? 1 : 0,
              Hard: problem.difficulty === 'Hard' ? 1 : 0
            },
            avgFrequency: company.frequency
          });
        }
      });
    });

    // Calculate average frequency for each company
    companyStats.forEach(stats => {
      stats.avgFrequency = Math.round(stats.totalFrequency / stats.problemCount);
    });

    const sortedCompanies = Array.from(companyStats.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.totalFrequency - a.totalFrequency);

    return {
      topCompanies: sortedCompanies.slice(0, 10),
      totalCompanies: sortedCompanies.length,
      mostActive: sortedCompanies[0],
      highestAvgFreq: sortedCompanies.sort((a, b) => b.avgFrequency - a.avgFrequency)[0]
    };
  }, [problems]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Building2 className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold">Company Analytics</h3>
        <span className="text-sm text-gray-500">
          (Updated 3 days ago)
        </span>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-600" size={16} />
            <span className="text-sm font-medium text-blue-800">Total Companies</span>
          </div>
          <p className="text-xl font-bold text-blue-900 mt-1">
            {analytics.totalCompanies}
          </p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-sm font-medium text-green-800">Most Active</span>
          </div>
          <p className="text-sm font-bold text-green-900 mt-1">
            {analytics.mostActive?.name}
          </p>
          <p className="text-xs text-green-700">
            {analytics.mostActive?.problemCount} problems
          </p>
        </div>
      </div>

      {/* Top Companies */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="text-yellow-500" size={16} />
          Top 10 Companies
        </h4>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {analytics.topCompanies.map((company, index) => (
            <div
              key={company.slug}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <h5 className="font-medium text-gray-900">{company.name}</h5>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {company.problemCount} problems
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      {company.totalFrequency} total freq
                    </span>
                    <span>
                      Avg: {company.avgFrequency}
                    </span>
                  </div>

                  {/* Difficulty breakdown */}
                  <div className="mt-2 flex gap-2">
                    {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                      company.difficulties[diff] > 0 && (
                        <span
                          key={diff}
                          className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(diff)} bg-gray-50`}
                        >
                          {diff}: {company.difficulties[diff]}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {company.totalFrequency}
                  </div>
                  <div className="text-xs text-gray-500">frequency</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Calendar className="text-purple-500" size={16} />
          Quick Insights
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            • <strong>{analytics.mostActive?.name}</strong> asks the most questions 
            ({analytics.mostActive?.problemCount} problems)
          </p>
          <p>
            • <strong>{analytics.highestAvgFreq?.name}</strong> has the highest average frequency 
            ({analytics.highestAvgFreq?.avgFrequency} per problem)
          </p>
          <p>
            • Total of <strong>{analytics.totalCompanies}</strong> companies are tracked
          </p>
          <p className="text-xs text-gray-500 mt-2">
            💡 Focus on high-frequency problems from your target companies
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;