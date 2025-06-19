// src/hooks/useCanvasState.ts
import { useState, useCallback } from 'react';
import { CanvasElement, ToolType } from '@/types/canvas';
import { DEFAULT_CANVAS_STATE } from '@/constants/canvas';

export const useCanvasState = (
  initialElements: CanvasElement[] = [],
  onElementsChange?: (elements: CanvasElement[]) => void
) => {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [currentTool, setCurrentTool] = useState<ToolType>(DEFAULT_CANVAS_STATE.currentTool);
  const [currentColor, setCurrentColor] = useState(DEFAULT_CANVAS_STATE.currentColor);
  const [currentFillColor, setCurrentFillColor] = useState(DEFAULT_CANVAS_STATE.currentFillColor);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_CANVAS_STATE.strokeWidth);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const updateElements = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
    onElementsChange?.(newElements);
  }, [onElementsChange]);

  const addElement = useCallback((element: CanvasElement) => {
    const newElements = [...elements, element];
    saveToHistory(elements);
    updateElements(newElements);
  }, [elements, saveToHistory, updateElements]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateElements(newElements);
  }, [elements, updateElements]);

  const deleteElement = useCallback((elementId: string) => {
    const newElements = elements.filter(el => el.id !== elementId);
    saveToHistory(elements);
    updateElements(newElements);
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  }, [elements, selectedElement, saveToHistory, updateElements]);

  const clearCanvas = useCallback(() => {
    if (window.confirm('Clear the canvas? This cannot be undone.')) {
      saveToHistory(elements);
      updateElements([]);
      setSelectedElement(null);
    }
  }, [elements, saveToHistory, updateElements]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      updateElements(history[historyIndex - 1]);
    }
  }, [historyIndex, history, updateElements]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      updateElements(history[historyIndex + 1]);
    }
  }, [historyIndex, history, updateElements]);

  const deleteSelected = useCallback(() => {
    if (selectedElement) {
      deleteElement(selectedElement);
    }
  }, [selectedElement, deleteElement]);

  return {
    // State
    elements,
    currentTool,
    currentColor,
    currentFillColor,
    strokeWidth,
    selectedElement,
    historyIndex,
    history,
    
    // Setters
    setCurrentTool,
    setCurrentColor,
    setCurrentFillColor,
    setStrokeWidth,
    setSelectedElement,
    
    // Actions
    addElement,
    updateElement,
    updateElements,
    deleteElement,
    clearCanvas,
    undo,
    redo,
    deleteSelected,
    saveToHistory,
  };
};