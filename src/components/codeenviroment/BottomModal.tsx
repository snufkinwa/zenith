// src/components/codeenviroment/BottomModal.tsx
import React, { useState } from 'react';
import {
  Edit3,
  PenTool,
  Clock,
  Plus,
  Brain,
  MessageCircle,
  Sparkles,
  Users,
  Share2,
  Eye,
  UserPlus,
  LogOut,
} from 'lucide-react';

import NotesModal from './modals/NotesModal';
import CanvasModal from './modals/CanvasModal';
import PomodoroModal from './modals/PomodoroModal';
import PythonTutorModal from './modals/PythonTutorModal';
import CreateProblemModal from './modals/CreateProblemModal';
import AIHintsModal from './modals/AIHintsModal';

interface BottomModalProps {
  selectedProblem?: any;
  onProblemCreated?: (problem: any) => void;
  currentCode?: string;
}

const BottomModal: React.FC<BottomModalProps> = ({
  selectedProblem,
  onProblemCreated,
  currentCode = '' 
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalZIndices, setModalZIndices] = useState<Record<string, number>>(
    {},
  );

  // Session state (mock for now)
  const [isInSession, setIsInSession] = useState(false);
  const [sessionParticipants, setSessionParticipants] = useState<string[]>([
    'You',
  ]);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    bringToFront(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const bringToFront = (modalName: string) => {
    const maxZ = Math.max(...Object.values(modalZIndices), 1000);
    setModalZIndices((prev) => ({
      ...prev,
      [modalName]: maxZ + 1,
    }));
  };

  const handleStartSession = () => {
    // Mock session start - would integrate with AppSync
    setIsInSession(true);
    setSessionParticipants(['John', 'Sarah', 'You']);
    console.log('Starting collaborative session...');
  };

  const handleLeaveSession = () => {
    // Mock session leave - would integrate with AppSync
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
    openModal('pythonTutor');
  };

  const problemContext = selectedProblem
    ? {
        title: selectedProblem.title,
        description: selectedProblem.description,
        difficulty: selectedProblem.difficulty,
        tags: [] as string[],
        examples: selectedProblem.examples,
        constraints: selectedProblem.constraints,
      }
    : undefined;

  return (
    <div>
      {/* Bottom Action Bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Session Info or Tools Label */}
          <div className="flex items-center gap-3">
            {isInSession ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-3 py-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <Users size={14} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {sessionParticipants.length} in session
                  </span>
                </div>

                {/* Participant Avatars - positioned right next to session info */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-2">
                    {sessionParticipants.map((participant, index) => {
                      // Generate avatar based on participant name
                      const getAvatarUrl = (name: string) => {
                        if (name === 'You') {
                          // Use a default "You" avatar or get from user profile
                          return `https://ui-avatars.com/api/?name=You&background=3b82f6&color=ffffff&size=28&bold=true`;
                        }
                        // Generate avatar for other participants
                        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=28&bold=true`;
                      };

                      const getInitials = (name: string) => {
                        return name === 'You'
                          ? 'Y'
                          : name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2);
                      };

                      return (
                        <div
                          key={participant}
                          className={`group relative cursor-pointer transition-transform hover:z-10 hover:scale-110 ${
                            index > 0 ? 'hover:-translate-x-1' : ''
                          }`}
                          title={participant}
                        >
                          {/* Avatar Image */}
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                              participant === 'You'
                                ? 'border-blue-300 bg-blue-500 text-white shadow-md'
                                : 'border-gray-300 bg-gray-100 text-gray-700 shadow-sm'
                            }`}
                          >
                            <img
                              src={getAvatarUrl(participant)}
                              alt={participant}
                              className="h-full w-full rounded-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback =
                                  target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            {/* Fallback initials */}
                            <span className="hidden h-full w-full items-center justify-center rounded-full text-xs font-bold">
                              {getInitials(participant)}
                            </span>
                          </div>

                          {/* Active indicator for current user */}
                          {participant === 'You' && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                          )}

                          {/* Hover tooltip */}
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {participant}
                            <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show participant count if more than 4 participants */}
                  {sessionParticipants.length > 4 && (
                    <div className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 text-xs font-semibold text-gray-600">
                      +{sessionParticipants.length - 4}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleInviteToSession}
                  className="flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-100"
                  title="Invite people to session"
                >
                  <UserPlus size={12} />
                  Invite
                </button>
                <button
                  onClick={handleLeaveSession}
                  className="flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 transition-colors hover:bg-red-100"
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
                className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs text-green-700 transition-colors hover:bg-green-100"
                title="Start collaborative session"
              >
                <Share2 size={14} />
                Start Session
              </button>
            )}

            {/* Create Problem */}
            <button
              onClick={() => openModal('createProblem')}
              className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-xs text-green-700 transition-colors hover:bg-green-100"
              title="Create New Problem"
            >
              <Plus size={14} />
              New Problem
            </button>

            {/* Pomodoro Timer */}
            <button
              onClick={() => openModal('pomodoro')}
              className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-700 transition-colors hover:bg-red-100"
              title="Focus Timer"
            >
              <Clock size={14} />
              Pomodoro
            </button>

            {/* Notes */}
            <button
              onClick={() => openModal('notes')}
              className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100"
              title="Open Notes"
            >
              <Edit3 size={14} />
              Notes
            </button>

            {/* Canvas */}
            <button
              onClick={() => openModal('canvas')}
              className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-xs text-green-700 transition-colors hover:bg-green-100"
              title="Open Canvas"
            >
              <PenTool size={14} />
              Canvas
            </button>

            {/* Python Visualizer */}
            <button
              onClick={handleVisualizePython}
              className="flex items-center gap-2 rounded-md bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700 transition-colors hover:bg-yellow-100"
              title="Visualize Python Code"
            >
              <Eye size={14} />
              Visualize
            </button>

            {/* AI Tutor (consolidated) */}
            <button
              onClick={() => openModal('hints')}
              className="flex items-center gap-2 rounded-md bg-purple-50 px-3 py-1.5 text-xs text-purple-700 transition-colors hover:bg-purple-100"
              title="AI Tutor - Get hints or tutoring"
            >
              <Sparkles size={14} />
              AI Tutor
            </button>
          </div>
        </div>
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

        <PythonTutorModal
        isOpen={activeModal === 'pythonTutor'}
        onClose={closeModal}
        currentCode={currentCode}
        problemTitle={selectedProblem?.title}
        zIndex={modalZIndices.pythonTutor || 1006}
        onBringToFront={() => bringToFront('pythonTutor')}
      />

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
