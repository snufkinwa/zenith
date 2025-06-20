// src/components/codeenviroment/BottomModal.tsx
import React, { useState } from 'react';
import { Edit3, PenTool, Clock, Plus, Brain, MessageCircle, Sparkles, Users, Share2, Eye, UserPlus, LogOut } from 'lucide-react';

// Import existing modals
import NotesModal from './modals/NotesModal';
import CanvasModal from './modals/CanvasModal';
import PomodoroModal from './modals/PomodoroModal';
import CreateProblemModal from './modals/CreateProblemModal';
import AIHintsModal from './modals/AIHintsModal';

interface BottomModalProps {
  selectedProblem?: any;
  onProblemCreated?: (problem: any) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({ selectedProblem, onProblemCreated }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalZIndices, setModalZIndices] = useState<Record<string, number>>({});
  
  // Session state (mock for now)
  const [isInSession, setIsInSession] = useState(false);
  const [sessionParticipants, setSessionParticipants] = useState<string[]>(['You']);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    bringToFront(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const bringToFront = (modalName: string) => {
    const maxZ = Math.max(...Object.values(modalZIndices), 1000);
    setModalZIndices(prev => ({
      ...prev,
      [modalName]: maxZ + 1
    }));
  };

  const handleStartSession = () => {
    // Mock session start - would integrate with Movex
    setIsInSession(true);
    setSessionParticipants(['You', 'John', 'Sarah']);
    console.log('Starting collaborative session...');
  };

  const handleLeaveSession = () => {
    // Mock session leave - would integrate with Movex
    setIsInSession(false);
    setSessionParticipants(['You']);
    console.log('Left collaborative session...');
  };

  const handleInviteToSession = () => {
    // Mock invite functionality
    console.log('Opening invite modal...');
    // Would show invite link/email modal
  };

  const handleVisualizePython = () => {
    // Mock Python Tutor integration
    console.log('Opening Python Tutor visualization...');
    // Would open Python Tutor modal with current code
  };

  const problemContext = selectedProblem ? {
    title: selectedProblem.title,
    description: selectedProblem.description,
    difficulty: selectedProblem.difficulty,
    tags: [] as string[], 
    examples: selectedProblem.examples,
    constraints: selectedProblem.constraints
  } : undefined;

  return (
    <div>
      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Session Info or Tools Label */}
          <div className="flex items-center gap-3">
            {isInSession ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Users size={14} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {sessionParticipants.length} in session
                  </span>
                </div>
                <button
                  onClick={handleInviteToSession}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors"
                  title="Invite people to session"
                >
                  <UserPlus size={12} />
                  Invite
                </button>
                <button
                  onClick={handleLeaveSession}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 transition-colors"
                  title="Leave session"
                >
                  <LogOut size={12} />
                  Leave
                </button>
              </div>
            ) : (
              <h3 className="text-sm font-medium text-gray-700">Tools</h3>
            )}
          </div>

          {/* Right Side - Tool Buttons */}
          <div className="flex items-center gap-2">
            {/* Session Management */}
            {!isInSession && (
              <button
                onClick={handleStartSession}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors border border-green-200"
                title="Start collaborative session"
              >
                <Share2 size={14} />
                Start Session
              </button>
            )}

            {/* Create Problem */}
            <button
              onClick={() => openModal('createProblem')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
              title="Create New Problem"
            >
              <Plus size={14} />
              New Problem
            </button>

            {/* Pomodoro Timer */}
            <button
              onClick={() => openModal('pomodoro')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
              title="Focus Timer"
            >
              <Clock size={14} />
              Pomodoro
            </button>

            {/* Notes */}
            <button
              onClick={() => openModal('notes')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
              title="Open Notes"
            >
              <Edit3 size={14} />
              Notes
            </button>

            {/* Canvas */}
            <button
              onClick={() => openModal('canvas')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
              title="Open Canvas"
            >
              <PenTool size={14} />
              Canvas
            </button>

            {/* Python Visualizer */}
            <button
              onClick={handleVisualizePython}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-md transition-colors"
              title="Visualize Python Code"
            >
              <Eye size={14} />
              Visualize
            </button>

            {/* AI Tutor (consolidated) */}
            <button
              onClick={() => openModal('hints')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors"
              title="AI Tutor - Get hints or tutoring"
            >
              <Sparkles size={14} />
              AI Tutor
            </button>
          </div>
        </div>

        {/* Session Participants (when in session) */}
        {isInSession && sessionParticipants.length > 1 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Participants:</span>
              <div className="flex items-center gap-1">
                {sessionParticipants.map((participant, index) => (
                  <div
                    key={participant}
                    className={`px-2 py-1 text-xs rounded ${
                      participant === 'You' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {participant}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Existing Modals */}
      <NotesModal
        isOpen={activeModal === 'notes'}
        onClose={closeModal}
        zIndex={modalZIndices.notes || 1001}
        onBringToFront={() => bringToFront('notes')}
      />

      <CanvasModal
        isOpen={activeModal === 'canvas'}
        onClose={closeModal}
        zIndex={modalZIndices.canvas || 1002}
        onBringToFront={() => bringToFront('canvas')}
      />

      <PomodoroModal
        isOpen={activeModal === 'pomodoro'}
        onClose={closeModal}
        zIndex={modalZIndices.pomodoro || 1003}
        onBringToFront={() => bringToFront('pomodoro')}
      />

      {onProblemCreated && (
        <CreateProblemModal
          isOpen={activeModal === 'createProblem'}
          onClose={closeModal}
          onCreateProblem={onProblemCreated}
          zIndex={modalZIndices.createProblem || 1004}
          onBringToFront={() => bringToFront('createProblem')}
        />
      )}

      {/* AI Helper Modal (serves as both hints and tutor for now) */}
      <AIHintsModal
        isOpen={activeModal === 'hints'}
        onClose={closeModal}
        problemContext={problemContext}
        zIndex={modalZIndices.hints || 1005}
        onBringToFront={() => bringToFront('hints')}
      />
    </div>
  );
};

export default BottomModal;