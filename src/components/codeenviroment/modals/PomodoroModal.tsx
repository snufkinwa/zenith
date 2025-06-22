'use client';

import React from 'react';
import { Clock as TimerIcon } from 'lucide-react';
import DraggableModal from './DraggableModal';
import PomodoroTimer from './pomodoro-timer';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onBringToFront,
}) => {
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
      <div className="h-full overflow-auto p-4">
        <PomodoroTimer
          onSessionComplete={() => {
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

export default PomodoroModal;
