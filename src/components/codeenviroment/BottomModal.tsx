import React, { useState, useRef, useEffect } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import PomodoroTimer from './pomodoro-timer';
import { X, Maximize2, Minimize2, Edit3, Search, PenTool, RotateCcw, Brain, Send, Lightbulb, Timer as TimerIcon, Clock } from 'lucide-react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  icon?: React.ReactNode;
  zIndex?: number;
  onBringToFront?: () => void;
}

const DraggableModal: React.FC<ModalProps> = ({ 
  title, 
  isOpen, 
  onClose, 
  children, 
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 500 },
  icon,
  zIndex = 1000,
  onBringToFront
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState({ position: initialPosition, size: initialSize });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startMouseX: number; startMouseY: number } | null>(null);
  const resizeRef = useRef<{ startWidth: number; startHeight: number; startMouseX: number; startMouseY: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const deltaX = e.clientX - dragRef.current.startMouseX;
        const deltaY = e.clientY - dragRef.current.startMouseY;
        
        setPosition({
          x: Math.max(0, dragRef.current.startX + deltaX),
          y: Math.max(0, dragRef.current.startY + deltaY),
        });
      }
      
      if (isResizing && resizeRef.current) {
        const deltaX = e.clientX - resizeRef.current.startMouseX;
        const deltaY = e.clientY - resizeRef.current.startMouseY;
        
        setSize({
          width: Math.max(300, resizeRef.current.startWidth + deltaX),
          height: Math.max(200, resizeRef.current.startHeight + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragRef.current = null;
      resizeRef.current = null;
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      dragRef.current = {
        startX: position.x,
        startY: position.y,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
      };
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startWidth: size.width,
      startHeight: size.height,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    };
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition(previousState.position);
      setSize(previousState.size);
      setIsMaximized(false);
    } else {
      setPreviousState({ position, size });
      setPosition({ x: 20, y: 20 });
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setIsMaximized(true);
    }
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: zIndex,
  };

  return (
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={modalStyle}
      onClick={onBringToFront}
    >
      {/* Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMaximize}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="h-full overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {children}
      </div>
      
      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          onMouseDown={handleResizeMouseDown}
          style={{
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          }}
        />
      )}
    </div>
  );
};

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, zIndex, onBringToFront }) => {
  const [notes, setNotes] = useState('');

  return (
    <DraggableModal
      title="Notes"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 150, y: 150 }}
      initialSize={{ width: 500, height: 400 }}
      icon={<Edit3 size={16} className="text-blue-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="p-4 h-full">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full h-full border-none outline-none resize-none text-sm font-mono bg-gray-50 p-3 rounded"
        />
      </div>
    </DraggableModal>
  );
};

interface CanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const CanvasModal: React.FC<CanvasModalProps> = ({ isOpen, onClose, zIndex, onBringToFront }) => {
  return (
    <DraggableModal
      title="Canvas"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 200, y: 100 }}
      initialSize={{ width: 800, height: 600 }}
      icon={<PenTool size={16} className="text-green-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="w-full h-full">
        <Tldraw />
      </div>
    </DraggableModal>
  );
};

interface AIHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const AIHintsModal: React.FC<AIHintsModalProps> = ({ isOpen, onClose, zIndex, onBringToFront }) => {
  const [query, setQuery] = useState('');
  const [hints, setHints] = useState<Array<{ question: string; answer: string; timestamp: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleAskHint = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // This would call your AI hints API
      // For demo purposes, we'll simulate different responses
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        "Try breaking this problem down step by step. What data structure would help you track elements efficiently?",
        "Consider using a hash map to store values and their indices. This can reduce your time complexity significantly.",
        "Think about the two-pointer technique. Can you sort the array first, then use pointers from both ends?",
        "This looks like a dynamic programming problem. What's the base case, and how do subproblems relate?",
        "Binary search might be helpful here. What property of the data makes it searchable?",
        "Consider the edge cases: empty input, single element, duplicates. How should your algorithm handle these?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setHints(prev => [...prev, {
        question: query,
        answer: randomResponse,
        timestamp
      }]);
      
      setQuery('');
    } catch (error) {
      setHints(prev => [...prev, {
        question: query,
        answer: "Sorry, I couldn&apos;t generate a hint right now. Please try again.",
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
        {/* Input Section */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskHint()}
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
                    <p className="text-sm text-purple-800">{hint.answer}</p>
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

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const PomodoroModal: React.FC<PomodoroModalProps> = ({ isOpen, onClose, zIndex, onBringToFront }) => {
  return (
    <DraggableModal
      title="Focus Timer"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 100, y: 100 }}
      initialSize={{ width: 400, height: 600 }}
      icon={<TimerIcon size={16} className="text-red-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="p-4 h-full overflow-auto">
        <PomodoroTimer 
          onSessionComplete={() => {
            // Optional: Show celebration or save progress
            console.log('Pomodoro session completed!');
          }}
          onBreakComplete={() => {
            console.log('Break completed, back to work!');
          }}
        />
      </div>
    </DraggableModal>
  );
};


const BottomModal: React.FC = () => {
  const [modals, setModals] = useState({
    notes: false,
    canvas: false,
    search: false,
    hints: false,
    pomodoro: false,
  });

  const [zIndexes, setZIndexes] = useState({
    notes: 1000,
    canvas: 1000,
    search: 1000,
    hints: 1000,
    pomodoro: 1000,
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

  return (
    <div>
      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Tools</h3>
          <div className="flex items-center gap-2">
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
      />

    </div>
  );
};

export default BottomModal;