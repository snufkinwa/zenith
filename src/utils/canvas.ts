import { Point, CanvasElement } from '@/types/canvas';
import { LINE_HIT_TOLERANCE } from '@/constants/canvas';

export const getMousePosition = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
): Point => {
  const canvas = canvasRef.current;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};

export const isPointInRectangle = (
  point: Point,
  element: CanvasElement,
): boolean => {
  if (!element.width || !element.height) return false;
  return (
    point.x >= element.x &&
    point.x <= element.x + element.width &&
    point.y >= element.y &&
    point.y <= element.y + element.height
  );
};

export const isPointInCircle = (
  point: Point,
  element: CanvasElement,
): boolean => {
  if (!element.width) return false;
  const radius = element.width / 2;
  const centerX = element.x + radius;
  const centerY = element.y + radius;
  const distance = Math.sqrt(
    (point.x - centerX) ** 2 + (point.y - centerY) ** 2,
  );
  return distance <= radius;
};

export const isPointNearLine = (
  point: Point,
  element: CanvasElement,
  tolerance: number = LINE_HIT_TOLERANCE,
): boolean => {
  if (element.endX === undefined || element.endY === undefined) return false;

  const A = point.y - element.y;
  const B = element.x - point.x;
  const C = element.endX * element.y - element.x * element.endY;
  const distance =
    Math.abs(A * element.endX + B * element.endY + C) /
    Math.sqrt(A * A + B * B);
  return distance <= tolerance;
};

export const isPointInText = (
  point: Point,
  element: CanvasElement,
): boolean => {
  if (!element.text) return false;
  const textWidth = element.text.length * 10; // rough estimate
  const textHeight = 20;
  return (
    point.x >= element.x &&
    point.x <= element.x + textWidth &&
    point.y >= element.y - textHeight &&
    point.y <= element.y
  );
};

export const findElementAtPosition = (
  position: Point,
  elements: CanvasElement[],
): CanvasElement | null => {
  // Check in reverse order (top to bottom)
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];

    switch (element.type) {
      case 'rectangle':
        if (isPointInRectangle(position, element)) return element;
        break;
      case 'circle':
        if (isPointInCircle(position, element)) return element;
        break;
      case 'line':
      case 'arrow':
        if (isPointNearLine(position, element)) return element;
        break;
      case 'text':
        if (isPointInText(position, element)) return element;
        break;
    }
  }
  return null;
};

export const createNewElement = (
  id: string,
  type: CanvasElement['type'],
  startPoint: Point,
  endPoint: Point,
  color: string,
  fillColor: string,
  strokeWidth: number,
  text?: string,
): CanvasElement => {
  const element: CanvasElement = {
    id,
    type,
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
    color,
    fillColor,
    strokeWidth,
  };

  switch (type) {
    case 'rectangle':
      element.width = Math.abs(endPoint.x - startPoint.x);
      element.height = Math.abs(endPoint.y - startPoint.y);
      break;
    case 'circle':
      const size = Math.max(
        Math.abs(endPoint.x - startPoint.x),
        Math.abs(endPoint.y - startPoint.y),
      );
      element.width = size;
      element.height = size;
      break;
    case 'line':
    case 'arrow':
      element.x = startPoint.x;
      element.y = startPoint.y;
      element.endX = endPoint.x;
      element.endY = endPoint.y;
      break;
    case 'text':
      element.x = startPoint.x;
      element.y = startPoint.y;
      element.text = text;
      break;
  }

  return element;
};

export const generateElementId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
