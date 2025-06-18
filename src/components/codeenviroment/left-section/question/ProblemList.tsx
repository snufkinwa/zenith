import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Search, ChevronDown, Clock, Star, Zap, Filter } from "lucide-react";

// Updated interface to match your new JSON format
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

interface ProblemListProps {
  problems: Problem[];
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
  showSimilarOnly?: boolean;
}

const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
  showSimilarOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(showSimilarOnly ? 5 : 10);

  // Function to get clean preview text from description (no parsing needed!)
  const getCleanPreview = (description: string, maxLength: number = 120) => {
    return description.trim().substring(0, maxLength);
  };

  // Extract keywords from text for similarity matching
  const extractKeywords = (text: string) => {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cannot', 'you', 
      'your', 'we', 'our', 'they', 'their', 'them', 'this', 'that', 'these', 'those',
      'given', 'return', 'example', 'input', 'output', 'explanation', 'constraints'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .slice(0, 10);
  };

  // Function to find similar problems
  const getSimilarProblems = (currentProblem: Problem | null, allProblems: Problem[]) => {
    if (!currentProblem) return allProblems.slice(0, 10);

    const keywords = extractKeywords(currentProblem.title + " " + currentProblem.description);
    const currentDifficulty = currentProblem.difficulty?.toLowerCase();

    return allProblems
      .filter(p => p.id !== currentProblem.id)
      .map(problem => {
        let score = 0;
        
        // Same difficulty gets higher score
        if (problem.difficulty?.toLowerCase() === currentDifficulty) {
          score += 30;
        }
        
        // Adjacent difficulty gets medium score
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIdx = difficulties.indexOf(currentDifficulty || '');
        const problemIdx = difficulties.indexOf(problem.difficulty?.toLowerCase() || '');
        if (Math.abs(currentIdx - problemIdx) === 1) {
          score += 15;
        }

        // Common keywords in title get high score
        const problemKeywords = extractKeywords(problem.title);
        keywords.forEach(keyword => {
          if (problemKeywords.includes(keyword)) {
            score += 20;
          }
        });

        // Common keywords in description get lower score
        const descriptionKeywords = extractKeywords(problem.description);
        keywords.forEach(keyword => {
          if (descriptionKeywords.includes(keyword)) {
            score += 5;
          }
        });

        return { problem, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, showSimilarOnly ? 15 : 25)
      .map(item => item.problem);
  };

  // Get the problems to display based on mode
  const problemsToFilter = showSimilarOnly && selectedProblem 
    ? getSimilarProblems(selectedProblem, problems)
    : problems;

  // Filtered and limited problems list
  const { filteredProblems, totalCount } = useMemo(() => {
    let filtered = problemsToFilter;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(problem => 
        problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    return {
      filteredProblems: isExpanded ? filtered : filtered.slice(0, displayLimit),
      totalCount: filtered.length
    };
  }, [problemsToFilter, searchQuery, difficultyFilter, isExpanded, displayLimit]);

  // Auto-select first problem on mount
useEffect(() => {
  // Only log when problems load, don't auto-select anything
  if (problems.length > 0) {
    console.log(`Loaded ${problems.length} problems`);
  }
}, [problems]);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return <Zap className="w-3 h-3 text-green-500" />;
      case 'medium':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'hard':
        return <Star className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {showSimilarOnly ? 'Similar Problems' : 'Problems'}
        </h2>
        <span className="text-sm text-gray-500">
          {totalCount} problem{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-2">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => onSelectProblem(problem)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProblem?.id === problem.id
                ? 'border-blue-300 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {/* Problem Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {problem.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {getDifficultyIcon(problem.difficulty)}
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Problem Preview */}
            <div className="text-sm text-gray-600">
              <div className="line-clamp-2">
                <ReactMarkdown>
                  {getCleanPreview(problem.description, selectedProblem?.id === problem.id ? 300 : 150)}
                </ReactMarkdown>
              </div>
            </div>

            {/* Tags/Keywords Preview (for selected item) */}
            {selectedProblem?.id === problem.id && (
              <div className="mt-3 pt-2 border-t border-blue-200">
                <div className="flex flex-wrap gap-1">
                  {extractKeywords(problem.title + " " + problem.description)
                    .slice(0, 5)
                    .map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!isExpanded && filteredProblems.length < totalCount && (
        <div className="text-center pt-2">
          <button
            onClick={() => setDisplayLimit(prev => Math.min(prev + 10, totalCount))}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto"
          >
            <span>Show more problems</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemList;