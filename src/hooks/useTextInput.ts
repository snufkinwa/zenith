import { useState, useCallback } from 'react';
import { Point } from '@/types/canvas';

export const useTextInput = () => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Point>({ x: 0, y: 0 });

  const showTextInputAt = useCallback((position: Point) => {
    setTextPosition(position);
    setShowTextInput(true);
    setTextInput('');
  }, []);

  const hideTextInput = useCallback(() => {
    setShowTextInput(false);
    setTextInput('');
  }, []);

  const updateTextInput = useCallback((text: string) => {
    setTextInput(text);
  }, []);

  return {
    // State
    showTextInput,
    textInput,
    textPosition,
    
    // Actions
    showTextInputAt,
    hideTextInput,
    updateTextInput,
    setShowTextInput,
    setTextInput,
    setTextPosition,
  };
};