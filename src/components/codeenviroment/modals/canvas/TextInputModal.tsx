import React from 'react';
import { Point } from '@/types/canvas';

interface TextInputModalProps {
  show: boolean;
  position: Point;
  value: string;
  canvasWidth: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TextInputModal: React.FC<TextInputModalProps> = ({
  show,
  position,
  value,
  canvasWidth,
  onChange,
  onSubmit,
  onCancel,
}) => {
  if (!show) return null;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="absolute z-10 rounded border border-gray-300 bg-white p-3 shadow-lg"
      style={{
        left: Math.min(position.x, canvasWidth - 200),
        top: Math.max(position.y - 60, 10),
      }}
    >
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter text..."
          className="w-48 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
          >
            Add Text
          </button>
          <button
            onClick={onCancel}
            className="rounded bg-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;
