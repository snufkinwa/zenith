'use client';

import React from 'react';
import { PenTool } from 'lucide-react';
import { Tldraw } from 'tldraw';
import DraggableModal from './DraggableModal';

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

export default CanvasModal;