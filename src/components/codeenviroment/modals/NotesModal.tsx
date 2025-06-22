'use client';

import React, { useState } from 'react';
import { Edit3, Save, FileText } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onBringToFront,
}) => {
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = () => {
    localStorage.setItem('coding-notes', notes);
    setLastSaved(new Date());
  };

  const handleLoad = () => {
    const savedNotes = localStorage.getItem('coding-notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  };

  // Load notes when modal opens
  React.useEffect(() => {
    if (isOpen) {
      handleLoad();
    }
  }, [isOpen]);

  return (
    <DraggableModal
      title="Notes"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 100, y: 150 }}
      initialSize={{ width: 500, height: 400 }}
      icon={<Edit3 size={16} className="text-blue-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="flex h-full flex-col p-4">
        {/* Header with save button */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Problem Notes
            </span>
          </div>
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-gray-500">
                Saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
            >
              <Save size={12} />
              Save
            </button>
          </div>
        </div>

        {/* Notes textarea */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes about the problem, your approach, or anything else..."
          className="w-full flex-1 resize-none rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Tips */}
        <div className="mt-3 rounded-md bg-blue-50 p-2">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Use this space to jot down your thought
            process, algorithm ideas, edge cases, or anything that helps you
            solve the problem.
          </p>
        </div>
      </div>
    </DraggableModal>
  );
};

export default NotesModal;
