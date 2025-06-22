'use client';

import React, { useRef } from 'react';
import { AlgorithmCanvasProps, CanvasElement } from '@/types/canvas';
import { generateElementId } from '@/utils/canvas';

// Custom hooks
import { useCanvasState } from '@/hooks/useCanvasState';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { useTextInput } from '@/hooks/useTextInput';
import { useCanvasEvents } from '@/hooks/useCanvasEvents';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';

// Components
import CanvasToolbar from '@/components/codeenviroment/modals/canvas/CanvasToolBar';
import TextInputModal from '@/components/codeenviroment/modals/canvas/TextInputModal';
import CanvasStatusBar from '@/components/codeenviroment/modals/canvas/CanvasStatusBar';

const AlgorithmCanvas: React.FC<AlgorithmCanvasProps> = ({
  width,
  height,
  onElementsChange,
  initialElements = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State management hooks
  const canvasState = useCanvasState(initialElements, onElementsChange);
  const drawingState = useCanvasDrawing();
  const textInputState = useTextInput();

  // Event handling
  const canvasEvents = useCanvasEvents({
    canvasRef,
    currentTool: canvasState.currentTool,
    currentColor: canvasState.currentColor,
    currentFillColor: canvasState.currentFillColor,
    strokeWidth: canvasState.strokeWidth,
    elements: canvasState.elements,
    selectedElement: canvasState.selectedElement,
    isDrawing: drawingState.isDrawing,
    startPoint: drawingState.startPoint,
    dragOffset: drawingState.dragOffset,
    setSelectedElement: canvasState.setSelectedElement,
    startDrawing: drawingState.startDrawing,
    stopDrawing: drawingState.stopDrawing,
    updatePreview: drawingState.updatePreview,
    startDragging: drawingState.startDragging,
    stopDragging: drawingState.stopDragging,
    showTextInputAt: textInputState.showTextInputAt,
    addElement: canvasState.addElement,
    updateElement: canvasState.updateElement,
    saveToHistory: canvasState.saveToHistory,
  });

  // Canvas rendering
  useCanvasRenderer({
    canvasRef,
    width,
    height,
    elements: canvasState.elements,
    selectedElement: canvasState.selectedElement,
    previewElement: drawingState.previewElement,
  });

  // Text element creation
  const handleAddText = () => {
    if (!textInputState.textInput.trim()) return;

    const newElement: CanvasElement = {
      id: generateElementId(),
      type: 'text',
      x: textInputState.textPosition.x,
      y: textInputState.textPosition.y,
      text: textInputState.textInput,
      color: canvasState.currentColor,
      strokeWidth: 1,
    };

    canvasState.addElement(newElement);
    textInputState.hideTextInput();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Toolbar */}
      <CanvasToolbar
        currentTool={canvasState.currentTool}
        currentColor={canvasState.currentColor}
        historyIndex={canvasState.historyIndex}
        historyLength={canvasState.history.length}
        onToolChange={canvasState.setCurrentTool}
        onColorChange={canvasState.setCurrentColor}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onClear={canvasState.clearCanvas}
      />

      {/* Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={canvasEvents.handleMouseDown}
          onMouseMove={canvasEvents.handleMouseMove}
          onMouseUp={canvasEvents.handleMouseUp}
          className="cursor-crosshair border"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Text Input Modal */}
        <TextInputModal
          show={textInputState.showTextInput}
          position={textInputState.textPosition}
          value={textInputState.textInput}
          canvasWidth={width}
          onChange={textInputState.updateTextInput}
          onSubmit={handleAddText}
          onCancel={textInputState.hideTextInput}
        />
      </div>

      {/* Status Bar */}
      <CanvasStatusBar
        currentTool={canvasState.currentTool}
        currentColor={canvasState.currentColor}
        elementCount={canvasState.elements.length}
      />
    </div>
  );
};

export default AlgorithmCanvas;
