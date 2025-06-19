'use client';

import React, { useState } from 'react';
import { Clock, Edit3, PenTool, Brain, Plus } from 'lucide-react';

import AIHintsModal from './modals/AIHintsModal';
import NotesModal from './modals/NotesModal';
import CanvasModal from './modals/CanvasModal';
import PomodoroModal from './modals/PomodoroModal';
import CreateProblemModal from './modals/CreateProblemModal';
import { createCustomProblem, NewProblemData } from '@/utils/customProblems';

// Define the Problem interface to match your CodeEnvironment
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

interface BottomModalProps {
  selectedProblem?: Problem | null;
  onProblemCreated?: (problem: Problem) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({ selectedProblem, onProblemCreated }) => {
  const [modals, setModals] = useState({
    notes: false,
    canvas: false,
    hints: false,
    pomodoro: false,
    createProblem: false,
  });

  const [zIndexes, setZIndexes] = useState({
    notes: 1000,
    canvas: 1000,
    hints: 1000,
    pomodoro: 1000,
    createProblem: 1000,
  });

  const [topZIndex, setTopZIndex] = useState(1000);

  const openModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
    bringToFront(modalType);
  };

  const closeModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  const bringToFront = (modalType: keyof typeof modals) => {
    const newZIndex = topZIndex + 1;
    setZIndexes(prev => ({ ...prev, [modalType]: newZIndex }));
    setTopZIndex(newZIndex);
  };

  // Handle creating a new problem
  const handleCreateProblem = async (problemData: NewProblemData) => {
    try {
      const newProblem = createCustomProblem(problemData);
      
      // Convert custom problem to regular problem format
      const convertedProblem: Problem = {
        ...newProblem,
        note: null,
        follow_up: undefined
      };
      
      if (onProblemCreated) {
        onProblemCreated(convertedProblem);
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };
  const problemContext = selectedProblem ? {
    title: selectedProblem.title,
    description: selectedProblem.description,
    difficulty: selectedProblem.difficulty,
    tags: [] as string[], // You can add tags if they exist in your problem data
    // Add any other relevant problem information
    examples: selectedProblem.examples,
    constraints: selectedProblem.constraints
  } : undefined;

  return (
    <div>
      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Tools</h3>
          <div className="flex items-center gap-2">
             <button
              onClick={() => openModal('createProblem')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
              title="Create New Problem"
            >
              <Plus size={14} />
              New Problem
            </button>
            <button
              onClick={() => openModal('pomodoro')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
              title="Focus Timer"
            >
              <Clock size={14} />
              Pomodoro
            </button>
            <button
              onClick={() => openModal('notes')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
              title="Open Notes"
            >
              <Edit3 size={14} />
              Notes
            </button>
            <button
              onClick={() => openModal('canvas')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
              title="Open Canvas"
            >
              <PenTool size={14} />
              Canvas
            </button>
            <button
              onClick={() => openModal('hints')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors"
              title="Open AI Hints"
            >
              <Brain size={14} />
              AI Hints
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
        <CreateProblemModal 
        isOpen={modals.createProblem} 
        onClose={() => closeModal('createProblem')} 
        zIndex={zIndexes.createProblem}
        onBringToFront={() => bringToFront('createProblem')}
        onCreateProblem={handleCreateProblem}
      /> 

      <PomodoroModal 
        isOpen={modals.pomodoro} 
        onClose={() => closeModal('pomodoro')} 
        zIndex={zIndexes.pomodoro}
        onBringToFront={() => bringToFront('pomodoro')}
      />
      
      <NotesModal 
        isOpen={modals.notes} 
        onClose={() => closeModal('notes')} 
        zIndex={zIndexes.notes}
        onBringToFront={() => bringToFront('notes')}
      />
      
      <CanvasModal 
        isOpen={modals.canvas} 
        onClose={() => closeModal('canvas')} 
        zIndex={zIndexes.canvas}
        onBringToFront={() => bringToFront('canvas')}
      />
      
      <AIHintsModal 
        isOpen={modals.hints} 
        onClose={() => closeModal('hints')} 
        zIndex={zIndexes.hints}
        onBringToFront={() => bringToFront('hints')}
        problemContext={problemContext}
      />
    </div>
  );
};

export default BottomModal;