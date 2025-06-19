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
  problemContext 
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
      const context = problemContext ? 
        `Problem: ${problemContext.title || 'Unknown'}\n` +
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
          useWebSearch: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setHints(prev => [...prev, {
        question: query,
        answer: data.hint || "No hint generated.",
        timestamp
      }]);
      
      setQuery('');
    } catch (error) {
      console.error('Error fetching hint:', error);
      
      setHints(prev => [...prev, {
        question: query,
        answer: "Sorry, I couldn't generate a hint right now. Please try again.",
        timestamp
      }]);
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
      <div className="p-4 h-full flex flex-col">
        {/* Show current problem context if available */}
        {problemContext && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md text-xs">
            <strong>Current Problem:</strong> {problemContext.title || 'Unknown'}
            {problemContext.difficulty && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
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
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleAskHint()}
              placeholder="Ask for a hint about the problem..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              onClick={handleAskHint}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-colors text-sm flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ask questions like: &quot;How do I approach this?&quot;, &quot;What algorithm should I use?&quot;, &quot;Help with time complexity&quot;
          </p>
        </div>

        {/* Hints History */}
        <div className="flex-1 overflow-auto">
          {hints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No hints yet!</p>
              <p className="text-sm">Ask the AI for help with the problem above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Hint History</h3>
                <button
                  onClick={clearHints}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  Clear
                </button>
              </div>
              
              {hints.map((hint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">Q</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">You asked:</span>
                    <span className="text-xs text-gray-500 ml-auto">{hint.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 pl-8">{hint.question}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain size={12} className="text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">AI suggests:</span>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-md p-3 ml-8">
                    <p className="text-sm text-purple-800 whitespace-pre-wrap">{hint.answer}</p>
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