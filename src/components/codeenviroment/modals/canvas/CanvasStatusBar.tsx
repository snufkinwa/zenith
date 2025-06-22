import React from 'react';
import { ToolType } from '@/types/canvas';

interface CanvasStatusBarProps {
  currentTool: ToolType;
  currentColor: string;
  elementCount: number;
}

const CanvasStatusBar: React.FC<CanvasStatusBarProps> = ({
  currentTool,
  currentColor,
  elementCount,
}) => {
  return (
    <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
      <span>
        Tool: {currentTool} | Color: {currentColor}
      </span>
      <span>{elementCount} elements</span>
    </div>
  );
};

export default CanvasStatusBar;
