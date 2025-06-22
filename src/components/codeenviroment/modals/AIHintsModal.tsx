'use client';

import React, { useState } from 'react';
import { Brain, Lightbulb, Send, RotateCcw } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface AIHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
  problemContext?: {
    title?: string;
    description?: string;
    difficulty?: string;
    tags?: string[];
  };
}

interface Hint {
  question: string;
  answer: string;
  timestamp: string;
}

const AIHintsModal: React.FC<AIHintsModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onBringToFront,
  problemContext,
}) => {
  const [query, setQuery] = useState('');
  const [hints, setHints] = useState<Hint[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskHint = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();

    try {
      // Build context from current problem if available
      const context = problemContext
        ? `Problem: ${problemContext.title || 'Unknown'}\n` +
          `Difficulty: ${problemContext.difficulty || 'Unknown'}\n` +
          `Tags: ${problemContext.tags?.join(', ') || 'None'}\n` +
          `Description: ${problemContext.description || 'No description available'}`
        : '';

      const response = await fetch('/api/hints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          context: context,
          useWebSearch: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setHints((prev) => [
        ...prev,
        {
          question: query,
          answer: data.hint || 'No hint generated.',
          timestamp,
        },
      ]);

      setQuery('');
    } catch (error) {
      console.error('Error fetching hint:', error);

      setHints((prev) => [
        ...prev,
        {
          question: query,
          answer:
            "Sorry, I couldn't generate a hint right now. Please try again.",
          timestamp,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHints = () => {
    setHints([]);
  };

  return (
    <DraggableModal
      title="AI Hints"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 300, y: 150 }}
      initialSize={{ width: 600, height: 500 }}
      icon={<Brain size={16} className="text-purple-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="flex h-full flex-col p-4">
        {/* Show current problem context if available */}
        {problemContext && (
          <div className="mb-3 flex items-center gap-2 rounded-md bg-gray-50 p-2 text-xs text-gray-700">
            <strong>Current Problem:</strong>{' '}
            {problemContext.title || 'Unknown'}
            {problemContext.difficulty && (
              <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-blue-800">
                {problemContext.difficulty}
              </span>
            )}
          </div>
        )}

        {/* Input Section */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && !loading && handleAskHint()
              }
              placeholder="Ask for a hint about the problem..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              onClick={handleAskHint}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700 disabled:bg-purple-400"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send size={16} />
              )}
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Ask questions like: &quot;How do I approach this?&quot;, &quot;What
            algorithm should I use?&quot;, &quot;Help with time complexity&quot;
          </p>
        </div>

        {/* Hints History */}
        <div className="flex-1 overflow-auto">
          {hints.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Lightbulb className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="font-medium">No hints yet!</p>
              <p className="text-sm">
                Ask the AI for help with the problem above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Hint History</h3>
                <button
                  onClick={clearHints}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw size={12} />
                  Clear
                </button>
              </div>

              {hints.map((hint, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-medium text-blue-600">
                        Q
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      You asked:
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      {hint.timestamp}
                    </span>
                  </div>
                  <p className="mb-3 pl-8 text-sm text-gray-700">
                    {hint.question}
                  </p>

                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                      <Brain size={12} className="text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      AI suggests:
                    </span>
                  </div>
                  <div className="ml-8 rounded-md border border-purple-200 bg-purple-50 p-3">
                    <p className="whitespace-pre-wrap text-sm text-purple-800">
                      {hint.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DraggableModal>
  );
};

export default AIHintsModal;
