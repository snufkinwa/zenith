import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Clock,
  Star,
  Zap,
  ChevronLeft,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
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
  className = '',
}) => {
  if (!problem) {
    return (
      <div
        className={`flex h-64 items-center justify-center text-gray-500 ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium">No problem selected</p>
          <p className="text-sm text-gray-400">
            Choose a problem to start coding
          </p>
        </div>
      </div>
    );
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return {
          icon: <Zap className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'medium':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      case 'hard':
        return {
          icon: <Star className="h-4 w-4" />,
          color: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          icon: <Star className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(problem.difficulty);

  function cleanIOString(str: string): string {
    if (!str) return '';

    try {
      return (
        str
          // Unescape backslashes before brackets and parentheses
          .replace(/\\([\[\]{}()])/g, '$1')
          // Clean up spacing around commas
          .replace(/,\s*/g, ', ')
          // Remove extra whitespace
          .trim()
      );
    } catch (error) {
      console.warn('Error cleaning IO string:', error);
      return str;
    }
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="rounded-full p-2 hover:bg-gray-100"
                title="Back to problems"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {problem.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${difficultyConfig.color}`}
            >
              {difficultyConfig.icon}
              {problem.difficulty}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <button className="p-1 hover:text-blue-600" title="Bookmark">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="p-1 hover:text-green-600" title="Like">
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button className="p-1 hover:text-red-600" title="Dislike">
                <ThumbsDown className="h-4 w-4" />
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
              console.log(
                `Problem ${problem.id} has ${highlights.length} highlights`,
              );
            }}
          />
        </div>

        {/* Examples - Direct mapping from JSON */}
        {problem.examples.map((example, index) => (
          <div key={index} className="mb-6">
            <h3 className="mb-3 font-semibold text-gray-800">
              Example {index + 1}
            </h3>
            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Input:</span>
                  <pre className="mt-1 overflow-x-auto rounded bg-gray-200 px-3 py-2 text-xs text-gray-800">
                    <code>{cleanIOString(example.input)}</code>
                  </pre>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Output:</span>
                  <pre className="mt-1 overflow-x-auto rounded bg-gray-200 px-3 py-2 text-xs text-gray-800">
                    <code>{cleanIOString(example.output)}</code>
                  </pre>
                </div>
                {example.explanation && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Explanation:
                    </span>
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
            <h3 className="mb-3 font-semibold text-gray-800">Constraints</h3>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <ul className="space-y-1 text-gray-700">
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
          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h4 className="mb-2 font-medium text-yellow-800">Follow-up</h4>
            <p className="text-sm text-yellow-700">
              <ReactMarkdown>{problem.follow_up}</ReactMarkdown>
            </p>
          </div>
        )}

        {/* Note if exists */}
        {problem.note && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-medium text-blue-800">Note</h4>
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
