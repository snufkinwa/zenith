// src/components/codeenviroment/BottomModal.tsx - SIMPLE VERSION
import React, { useState, useEffect } from 'react';
import {
  Edit3,
  PenTool,
  Clock,
  Plus,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Users,
  Share2,
  Eye,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

import NotesModal from './modals/NotesModal';
import CanvasModal from './modals/CanvasModal';
import PomodoroModal from './modals/PomodoroModal';
import PythonTutorModal from './modals/PythonTutorModal';
import CreateProblemModal from './modals/CreateProblemModal';
import AITutorModal from './modals/AITutorModal';

interface BottomModalProps {
  selectedProblem?: any;
  onProblemCreated?: (problem: any) => void;
  currentCode?: string;
}

const BottomModal: React.FC<BottomModalProps> = ({
  selectedProblem,
  onProblemCreated,
  currentCode = '',
}) => {
  // Simple state management
  const [user, setUser] = useState<import('aws-amplify/auth').AuthUser | null>(null);
  const [client, setClient] = useState<ReturnType<typeof generateClient<Schema>> | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalZIndices, setModalZIndices] = useState<Record<string, number>>({});

  // Session state
  const [isInSession, setIsInSession] = useState(false);
  const [sessionParticipants, setSessionParticipants] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Get authenticated user and client on mount
  useEffect(() => {
    const setupAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const authenticatedClient = generateClient<Schema>();
        
        setUser(currentUser);
        setClient(authenticatedClient);
        
        console.log('✅ BottomModal: Auth setup complete', currentUser.userId);
      } catch (error) {
        console.log('❌ BottomModal: Auth failed', error);
      }
    };

    setupAuth();
  }, []);

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

  const handleStartSession = async () => {
    if (!user || !client) {
      alert('Please wait for authentication to complete');
      return;
    }

    try {
      const newSessionId = `session-${Date.now()}`;
      const userName = user.signInDetails?.loginId?.split('@')[0] || user.userId?.slice(0, 8) || 'User';

      const sessionData = {
        sessionId: newSessionId,
        userId: user.userId,
        problemId: selectedProblem?.id || 'unknown',
        mode: 'collaboration',
        status: 'active',
        collaborators: JSON.stringify({
          [user.userId]: {
            name: userName,
            joinedAt: new Date().toISOString(),
            isOwner: true,
          },
        }),
        finalAnswer: currentCode,
        lastUpdated: Math.floor(Date.now() / 1000),
      };

      console.log('🚀 Creating session:', sessionData);
      await client.models.ZenithSession.create(sessionData);

      // Update local state
      setIsInSession(true);
      setSessionId(newSessionId);
      setSessionParticipants([userName]);
      
      console.log('✅ Session created successfully:', newSessionId);
      alert(`Session "${newSessionId}" started! Share this ID with collaborators.`);

    } catch (error) {
      console.error('❌ Error starting session:', error);
      alert(
        `Failed to start session: ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message
            : 'Unknown error'
        }`
      );
    }
  };

  const handleLeaveSession = async () => {
    try {
      if (sessionId && client) {
        // Update session status to inactive
        await client.models.ZenithSession.update({
          sessionId,
          status: 'inactive',
          lastUpdated: Math.floor(Date.now() / 1000),
          id: ''
        });
      }

      // Clear local state
      setIsInSession(false);
      setSessionParticipants([]);
      setSessionId('');
      
      console.log('✅ Left session successfully');
      alert('Left the session');
      
    } catch (error) {
      console.error('❌ Error leaving session:', error);
      // Clear local state anyway
      setIsInSession(false);
      setSessionParticipants([]);
      setSessionId('');
    }
  };

  const handleCopySessionId = async () => {
    if (!sessionId) return;

    try {
      await navigator.clipboard.writeText(sessionId);
      alert(`Session ID copied: ${sessionId}`);
    } catch (error) {
      console.error('Failed to copy session ID:', error);
      alert(`Session ID: ${sessionId}`);
    }
  };

  const getParticipantAvatar = (participant: string, isCurrentUser: boolean = false) => {
    const name = isCurrentUser ? user?.signInDetails?.loginId?.split('@')[0] || 'You' : participant;
    return {
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${isCurrentUser ? '3b82f6' : 'random'}&color=ffffff&size=28&bold=true`,
      initials: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
  };

  const handleVisualizePython = () => {
    openModal('pythonTutor');
  };

  const problemContext = selectedProblem
    ? {
        title: selectedProblem.title,
        description: selectedProblem.description,
        difficulty: selectedProblem.difficulty,
        tags: selectedProblem.tags || [],
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
                    Session: {sessionId.slice(-8)}
                  </span>
                </div>

                {/* Participant Avatars */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-2">
                    {sessionParticipants.map((participant, index) => {
                      const avatarData = getParticipantAvatar(
                        participant,
                        participant === 'You' || participant === user?.signInDetails?.loginId?.split('@')[0],
                      );

                      return (
                        <div
                          key={participant}
                          className={`group relative cursor-pointer transition-transform hover:z-10 hover:scale-110 ${
                            index > 0 ? 'hover:-translate-x-1' : ''
                          }`}
                          title={participant}
                        >
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                              participant === 'You' ||
                              participant === user?.signInDetails?.loginId?.split('@')[0]
                                ? 'border-blue-300 bg-blue-500 text-white shadow-md'
                                : 'border-gray-300 bg-gray-100 text-gray-700 shadow-sm'
                            }`}
                          >
                            <img
                              src={avatarData.avatar}
                              alt={participant}
                              className="h-full w-full rounded-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <span className="hidden h-full w-full items-center justify-center rounded-full text-xs font-bold">
                              {avatarData.initials}
                            </span>
                          </div>

                          {/* Active indicator for current user */}
                          {(participant === 'You' ||
                            participant === user?.signInDetails?.loginId?.split('@')[0]) && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleCopySessionId}
                  className="flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-100"
                  title="Copy session ID"
                >
                  <UserPlus size={12} />
                  Copy ID
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
            {/* Session Management - Always show since we're wrapped by Authenticator */}
            <button
              onClick={handleStartSession}
              className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs text-green-700 transition-colors hover:bg-green-100"
              title="Start collaborative session"
            >
              <Share2 size={14} />
              Session
            </button>

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

            {/* AI Tutor */}
            <button
              onClick={() => openModal('aiTutor')}
              className="flex items-center gap-2 rounded-md bg-purple-50 px-3 py-1.5 text-xs text-purple-700 transition-colors hover:bg-purple-100"
              title="AI Tutor - Get personalized help"
            >
              <GraduationCap size={14} />
              AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      <AITutorModal
        isOpen={activeModal === 'aiTutor'}
        onClose={closeModal}
        problemContext={problemContext}
        zIndex={modalZIndices.aiTutor || 1005}
        onBringToFront={() => bringToFront('aiTutor')}
      />
    </div>
  );
};

export default BottomModal;