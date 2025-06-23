'use client';

import React, { useState } from 'react';
import { GraduationCap, MessageCircle, Send, RotateCcw } from 'lucide-react';
import DraggableModal from './DraggableModal';
import { useAITutor } from '@/hooks/useAITutor';

interface AITutorModalProps {
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

interface TutorResponse {
  question: string;
  answer: string;
  timestamp: string;
}

const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onBringToFront,
  problemContext,
}) => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<TutorResponse[]>([]);
  const { getHint, loading } = useAITutor();

  const handleAskTutor = async () => {
    if (!query.trim()) return;

    const timestamp = new Date().toLocaleTimeString();

    try {
      // Build simple context for the AI tutor
      const context = problemContext
        ? `Working on: ${problemContext.title} (${problemContext.difficulty})`
        : '';

      const tutorResponse = await getHint(
        query.trim(),
        context,
        problemContext?.title,
      );

      setResponses((prev) => [
        ...prev,
        {
          question: query,
          answer: tutorResponse,
          timestamp,
        },
      ]);

      setQuery('');
    } catch (error) {
      console.error('Error from AI Tutor:', error);

      setResponses((prev) => [
        ...prev,
        {
          question: query,
          answer: "Sorry, I'm having trouble right now. Try asking again! 😊",
          timestamp,
        },
      ]);
    }
  };

  const clearResponses = () => {
    setResponses([]);
  };

  return (
    <DraggableModal
      title="AI Tutor"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 300, y: 150 }}
      initialSize={{ width: 600, height: 500 }}
      icon={<GraduationCap size={16} className="text-blue-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="flex h-full flex-col p-4">
        {/* Show current problem context if available */}
        {problemContext && (
          <div className="mb-3 flex items-center gap-2 rounded-md bg-blue-50 p-2 text-xs text-gray-700">
            <GraduationCap size={14} className="text-blue-600" />
            <strong>Helping with:</strong>{' '}
            {problemContext.title || 'Current Problem'}
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
                e.key === 'Enter' && !loading && handleAskTutor()
              }
              placeholder="Ask your tutor anything..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleAskTutor}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send size={16} />
              )}
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Try: &quot;How do I start?&quot;, &quot;What data structure should I
            use?&quot;, &quot;Explain this approach&quot;
          </p>
        </div>

        {/* Tutor Conversation */}
        <div className="flex-1 overflow-auto">
          {responses.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-blue-300" />
              <p className="font-medium">Hi! I&lsquo;m your coding tutor 👋</p>
              <p className="text-sm">
                Ask me anything about the problem - I&lsquo;m here to help you
                learn!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Our Conversation
                </h3>
                <button
                  onClick={clearResponses}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw size={12} />
                  Clear
                </button>
              </div>

              {responses.map((response, index) => (
                <div key={index} className="space-y-3">
                  {/* Student Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg bg-gray-100 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>You</span>
                        <span>{response.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800">
                        {response.question}
                      </p>
                    </div>
                  </div>

                  {/* Tutor Response */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <GraduationCap size={14} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-800">
                          Your Tutor
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-blue-900">
                        {response.answer}
                      </p>
                    </div>
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

export default AITutorModal;
