export interface Point {
  x: number;
  y: number;
}

export interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'text' | 'arrow';
  x: number;
  y: number;
  width?: number;
  height?: number;
  endX?: number;
  endY?: number;
  text?: string;
  color: string;
  fillColor?: string;
  strokeWidth: number;
}

export interface AlgorithmCanvasProps {
  width: number;
  height: number;
  onElementsChange?: (elements: CanvasElement[]) => void;
  initialElements?: CanvasElement[];
}

export type ToolType = 'select' | 'rectangle' | 'circle' | 'line' | 'text' | 'arrow';

export interface CanvasState {
  elements: CanvasElement[];
  currentTool: ToolType;
  currentColor: string;
  currentFillColor: string;
  strokeWidth: number;
  selectedElement: string | null;
  history: CanvasElement[][];
  historyIndex: number;
}

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  previewElement: CanvasElement | null;
  dragOffset: Point | null;
}

export interface TextInputState {
  showTextInput: boolean;
  textInput: string;
  textPosition: Point;
}