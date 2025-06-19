// src/hooks/useCanvasRenderer.ts
import { useCallback, useEffect } from 'react';
import { CanvasElement } from '@/types/canvas';
import { drawElement, drawSelection } from '@/utils/canvasDrawing';

interface UseCanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  elements: CanvasElement[];
  selectedElement: string | null;
  previewElement: CanvasElement | null;
}

export const useCanvasRenderer = ({
  canvasRef,
  width,
  height,
  elements,
  selectedElement,
  previewElement,
}: UseCanvasRendererProps) => {
  
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);


    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element);

      // Highlight selected element
      if (selectedElement === element.id) {
        drawSelection(ctx, element);
      }
    });

    // Draw preview element while drawing
    if (previewElement) {
      ctx.globalAlpha = 0.7;
      drawElement(ctx, previewElement);
      ctx.globalAlpha = 1.0;
    }
  }, [elements, selectedElement, width, height, previewElement, canvasRef]);

  // Draw whenever dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  return { draw };
};