export const CANVAS_COLORS = [
  '#33cc99', 
  '#124dff', 
  '#ff4444', 
  '#ffaa00', 
  '#9b59b6', 
  '#2ecc71', 
  '#e74c3c', 
  '#000000'
];

export const CANVAS_FILL_COLORS = [
  'transparent', 
  '#33cc9920', 
  '#124dff20', 
  '#ff444420', 
  '#ffaa0020', 
  '#9b59b620'
];

export const DEFAULT_CANVAS_STATE = {
  currentTool: 'select' as const,
  currentColor: '#33cc99',
  currentFillColor: 'transparent',
  strokeWidth: 2,
  selectedElement: null,
  history: [] as any[][],
  historyIndex: -1,
};

export const SELECTION_COLOR = '#007acc';
export const SELECTION_DASH = [5, 5];
export const LINE_HIT_TOLERANCE = 5;
export const MIN_ELEMENT_SIZE = 5;
export const ARROW_LENGTH = 15;
export const ARROW_ANGLE = Math.PI / 6;