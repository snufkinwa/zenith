import { useState, useCallback } from 'react';
import { Point, CanvasElement } from '@/types/canvas';

export const useCanvasDrawing = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewElement, setPreviewElement] = useState<CanvasElement | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState<Point | null>(null);

  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setStartPoint(point);
  }, []);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setPreviewElement(null);
    setDragOffset(null);
  }, []);

  const updatePreview = useCallback((preview: CanvasElement | null) => {
    setPreviewElement(preview);
  }, []);

  const startDragging = useCallback((offset: Point) => {
    setDragOffset(offset);
    setIsDrawing(true);
  }, []);

  const stopDragging = useCallback(() => {
    setDragOffset(null);
    setIsDrawing(false);
  }, []);

  return {
    // State
    isDrawing,
    startPoint,
    previewElement,
    dragOffset,

    // Actions
    startDrawing,
    stopDrawing,
    updatePreview,
    startDragging,
    stopDragging,
    setIsDrawing,
    setStartPoint,
    setPreviewElement,
    setDragOffset,
  };
};
