import React from 'react';
import { PenTool, Square, Circle, Type, Trash2, Undo, Redo } from 'lucide-react';
import { ToolType } from '@/types/canvas';
import { CANVAS_COLORS } from '@/constants/canvas';

interface CanvasToolbarProps {
  currentTool: ToolType;
  currentColor: string;
  historyIndex: number;
  historyLength: number;
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  currentTool,
  currentColor,
  historyIndex,
  historyLength,
  onToolChange,
  onColorChange,
  onUndo,
  onRedo,
  onClear,
}) => {
  const toolConfig = [
    { tool: 'select' as const, icon: PenTool, title: 'Select & Move' },
    { tool: 'rectangle' as const, icon: Square, title: 'Rectangle' },
    { tool: 'circle' as const, icon: Circle, title: 'Circle' },
    { tool: 'line' as const, icon: () => <>━━</>, title: 'Line' },
    { tool: 'arrow' as const, icon: () => <>↗</>, title: 'Arrow' },
    { tool: 'text' as const, icon: Type, title: 'Add Text' },
  ];

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      {/* Tools */}
      <div className="flex items-center gap-2">
        {toolConfig.map(({ tool, icon: Icon, title }) => (
          <button
            key={tool}
            onClick={() => onToolChange(tool)}
            className={`p-2 rounded ${
              currentTool === tool 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100'
            }`}
            title={title}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* Colors */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Colors:</span>
        {CANVAS_COLORS.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-6 h-6 rounded border-2 ${
              currentColor === color 
                ? 'border-gray-600' 
                : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={historyIndex <= 0}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={historyIndex >= historyLength - 1}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Redo"
        >
          <Redo size={16} />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded hover:bg-gray-100 text-red-600"
          title="Clear"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbar;