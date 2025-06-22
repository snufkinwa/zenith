import { useCallback } from 'react';
import { Point, CanvasElement, ToolType } from '@/types/canvas';
import {
  getMousePosition,
  findElementAtPosition,
  createNewElement,
  generateElementId,
} from '@/utils/canvas';
import { MIN_ELEMENT_SIZE } from '@/constants/canvas';

interface UseCanvasEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentTool: ToolType;
  currentColor: string;
  currentFillColor: string;
  strokeWidth: number;
  elements: CanvasElement[];
  selectedElement: string | null;
  isDrawing: boolean;
  startPoint: Point | null;
  dragOffset: Point | null;

  // State setters
  setSelectedElement: (id: string | null) => void;
  startDrawing: (point: Point) => void;
  stopDrawing: () => void;
  updatePreview: (preview: CanvasElement | null) => void;
  startDragging: (offset: Point) => void;
  stopDragging: () => void;
  showTextInputAt: (position: Point) => void;

  // Actions
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  saveToHistory: (elements: CanvasElement[]) => void;
}

export const useCanvasEvents = ({
  canvasRef,
  currentTool,
  currentColor,
  currentFillColor,
  strokeWidth,
  elements,
  selectedElement,
  isDrawing,
  startPoint,
  dragOffset,
  setSelectedElement,
  startDrawing,
  stopDrawing,
  updatePreview,
  startDragging,
  stopDragging,
  showTextInputAt,
  addElement,
  updateElement,
  saveToHistory,
}: UseCanvasEventsProps) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePosition(e, canvasRef);

      if (currentTool === 'text') {
        showTextInputAt(pos);
        return;
      }

      if (currentTool === 'select') {
        const clickedElement = findElementAtPosition(pos, elements);
        if (clickedElement) {
          setSelectedElement(clickedElement.id);
          const offset = {
            x: pos.x - clickedElement.x,
            y: pos.y - clickedElement.y,
          };
          startDragging(offset);
        } else {
          setSelectedElement(null);
        }
        return;
      }

      startDrawing(pos);
    },
    [
      canvasRef,
      currentTool,
      elements,
      setSelectedElement,
      startDrawing,
      startDragging,
      showTextInputAt,
    ],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !startPoint) return;

      const pos = getMousePosition(e, canvasRef);

      // Handle dragging selected element
      if (currentTool === 'select' && selectedElement && dragOffset) {
        updateElement(selectedElement, {
          x: pos.x - dragOffset.x,
          y: pos.y - dragOffset.y,
        });
        return;
      }

      // Create preview element for shapes
      if (currentTool !== 'select' && currentTool !== 'text') {
        const preview = createNewElement(
          'preview',
          currentTool,
          startPoint,
          pos,
          currentColor,
          currentFillColor,
          strokeWidth,
        );
        updatePreview(preview);
      }
    },
    [
      isDrawing,
      startPoint,
      canvasRef,
      currentTool,
      selectedElement,
      dragOffset,
      currentColor,
      currentFillColor,
      strokeWidth,
      updateElement,
      updatePreview,
    ],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      // If we were dragging a selected element, save to history
      if (currentTool === 'select' && selectedElement && dragOffset) {
        saveToHistory(elements);
        stopDragging();
        return;
      }

      if (!startPoint) return;
      const pos = getMousePosition(e, canvasRef);

      // Only create and add element if the tool is a drawable shape or text
      if (currentTool !== 'select') {
        const newElement = createNewElement(
          generateElementId(),
          currentTool as Exclude<ToolType, 'select'>,
          startPoint,
          pos,
          currentColor,
          currentFillColor,
          strokeWidth,
        );

        // Only add element if it's large enough
        const isLargeEnough =
          (newElement.width && newElement.width > MIN_ELEMENT_SIZE) ||
          (newElement.height && newElement.height > MIN_ELEMENT_SIZE) ||
          (newElement.endX &&
            Math.abs(newElement.endX - newElement.x) > MIN_ELEMENT_SIZE);

        if (isLargeEnough) {
          addElement(newElement);
        }
      }

      stopDrawing();
    },
    [
      isDrawing,
      currentTool,
      selectedElement,
      dragOffset,
      startPoint,
      elements,
      currentColor,
      currentFillColor,
      strokeWidth,
      canvasRef,
      saveToHistory,
      stopDragging,
      addElement,
      stopDrawing,
    ],
  );

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
