import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Clock, Star, Zap, ChevronLeft, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import HighlightableText from '@/components/ui/HighlightableText';

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
}

interface ProblemDisplayProps {
  problem: Problem | null;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ 
  problem, 
  showBackButton = false, 
  onBack,
  className = ""
}) => {
  if (!problem) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-500 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium">No problem selected</p>
          <p className="text-sm text-gray-400">Choose a problem to start coding</p>
        </div>
      </div>
    );
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return { icon: <Zap className="w-4 h-4" />, color: 'bg-green-100 text-green-800 border-green-200' };
      case 'medium':
        return { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'hard':
        return { icon: <Star className="w-4 h-4" />, color: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { icon: <Star className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const difficultyConfig = getDifficultyConfig(problem.difficulty);

function cleanIOString(str: string): string {
    if (!str) return '';
    
    try {
      return str
        // Unescape backslashes before brackets and parentheses
        .replace(/\\([\[\]{}()])/g, '$1')
        // Clean up spacing around commas
        .replace(/,\s*/g, ', ')
        // Remove extra whitespace
        .trim();
    } catch (error) {
      console.warn('Error cleaning IO string:', error);
      return str;
    }
  }


  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {showBackButton && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full" title="Back to problems">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${difficultyConfig.color}`}>
              {difficultyConfig.icon}
              {problem.difficulty}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <button className="p-1 hover:text-blue-600" title="Bookmark">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="p-1 hover:text-green-600" title="Like">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="p-1 hover:text-red-600" title="Dislike">
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-gray max-w-none">
        {/* Problem Description */}
        <div className="mb-6">
          <HighlightableText 
            content={problem.description}
            problemId={problem.id}
            isMarkdown={true}  
            className="text-gray-700"
            onHighlightChange={(highlights) => {
              console.log(`Problem ${problem.id} has ${highlights.length} highlights`);
            }}
          />
        </div>

        {/* Examples - Direct mapping from JSON */}
        {problem.examples.map((example, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Example {index + 1}</h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Input:</span>
                  <pre className="mt-1 bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs overflow-x-auto">
                    <code>{cleanIOString(example.input)}</code>
                  </pre>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Output:</span>
                  <pre className="mt-1 bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs overflow-x-auto">
                    <code>{cleanIOString(example.output)}</code>
                  </pre>
                </div>
                {example.explanation && (
                  <div>
                    <span className="font-medium text-gray-600">Explanation:</span>
                    <div className="mt-1 text-gray-700">
                      <ReactMarkdown>{example.explanation}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Constraints - Direct mapping from array */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-3">Constraints</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <ul className="text-gray-700 space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm">
                    <ReactMarkdown>{constraint}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Follow-up question if exists */}
        {problem.follow_up && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Follow-up</h4>
            <p className="text-sm text-yellow-700"><ReactMarkdown>{problem.follow_up}</ReactMarkdown></p>
          </div>
        )}

        {/* Note if exists */}
        {problem.note && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Note</h4>
            <div className="text-sm text-blue-700">
              <ReactMarkdown>{problem.note}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDisplay;