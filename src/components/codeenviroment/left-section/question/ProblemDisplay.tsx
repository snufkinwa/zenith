import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Clock, Star, Zap, ChevronLeft, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string | null;
  content: string;
}

interface Example {
  title: string;
  input: string;
  output: string;
  explanation: string;
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
    // Render placeholder if no problem is selected
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

  // Difficulty styling logic
  const getDifficultyConfig = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
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

  // FIXED: Better content parsing
  const parseContent = (content: string) => {
    // Clean up escaped newlines
    const cleanedContent = content.replace(/\\n/g, '\n');
    
    // Split by constraints first
    const constraintsSplit = cleanedContent.split(/\*\*Constraints:?\*\*/i);
    const mainContent = constraintsSplit[0];
    const constraints = constraintsSplit[1] || '';

    // Find all examples using a more robust regex
    const exampleRegex = /\*\*Example\s*(\d+):?\*\*([\s\S]*?)(?=\*\*Example\s*\d+:?\*\*|\*\*Constraints:?\*\*|$)/gi;
    const examples: Example[] = [];
    let match;
    
    // Extract examples
    while ((match = exampleRegex.exec(mainContent)) !== null) {
      const exampleNumber = match[1];
      const exampleContent = match[2];
      
      // Parse individual example components
      const inputMatch = exampleContent.match(/\*\*Input:?\*\*\s*([\s\S]*?)(?=\*\*Output:?\*\*)/i);
      const outputMatch = exampleContent.match(/\*\*Output:?\*\*\s*([\s\S]*?)(?=\*\*Explanation:?\*\*)/i);
      const explanationMatch = exampleContent.match(/\*\*Explanation:?\*\*\s*([\s\S]*?)$/i);
      
      examples.push({
        title: `Example ${exampleNumber}`,
        input: inputMatch ? inputMatch[1].trim().replace(/\\(.)/g, '$1') : '',
        output: outputMatch ? outputMatch[1].trim().replace(/\\(.)/g, '$1') : '',
        explanation: explanationMatch ? explanationMatch[1].trim() : '',
      });
    }

    // Get description by removing all examples from main content
    let description = mainContent;
    examples.forEach(() => {
      description = description.replace(exampleRegex, '');
    });
    
    // Clean up any leftover example markers
    description = description.replace(/\*\*Example\s*\d+:?\*\*[\s\S]*$/gi, '').trim();

    return { 
      description: description.trim(), 
      examples, 
      constraints: constraints.trim() 
    };
  };

  const { description, examples, constraints } = parseContent(problem.content);

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
              <button className="p-1 hover:text-blue-600" title="Bookmark"><Bookmark className="w-4 h-4" /></button>
              <button className="p-1 hover:text-green-600" title="Like"><ThumbsUp className="w-4 h-4" /></button>
              <button className="p-1 hover:text-red-600" title="Dislike"><ThumbsDown className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-gray max-w-none">
        {/* Problem Description */}
        {description && (
          <div className="mb-6">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        )}

        {/* Examples */}
        {examples.map((example, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">{example.title}</h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="space-y-3 text-sm">
                {example.input && (
                  <div>
                    <span className="font-medium text-gray-600">Input:</span>
                    <pre className="mt-1 bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs overflow-x-auto">
                      <code>{example.input}</code>
                    </pre>
                  </div>
                )}
                {example.output && (
                  <div>
                    <span className="font-medium text-gray-600">Output:</span>
                    <pre className="mt-1 bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs overflow-x-auto">
                      <code>{example.output}</code>
                    </pre>
                  </div>
                )}
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
        
        {/* Constraints */}
        {constraints && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-3">Constraints</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="prose prose-sm text-gray-700">
                <ReactMarkdown>{constraints}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDisplay;