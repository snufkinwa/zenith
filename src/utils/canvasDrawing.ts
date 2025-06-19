import { CanvasElement } from '@/types/canvas';
import { 
  SELECTION_COLOR, 
  SELECTION_DASH, 
  ARROW_LENGTH, 
  ARROW_ANGLE 
} from '@/constants/canvas';



export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  if (!element.width || !element.height) return;
  
  ctx.beginPath();
  ctx.rect(element.x, element.y, element.width, element.height);
  
  if (element.fillColor && element.fillColor !== 'transparent') {
    ctx.fill();
  }
  ctx.stroke();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  if (!element.width) return;
  
  const radius = element.width / 2;
  ctx.beginPath();
  ctx.arc(element.x + radius, element.y + radius, radius, 0, 2 * Math.PI);
  
  if (element.fillColor && element.fillColor !== 'transparent') {
    ctx.fill();
  }
  ctx.stroke();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  if (element.endX === undefined || element.endY === undefined) return;
  
  ctx.beginPath();
  ctx.moveTo(element.x, element.y);
  ctx.lineTo(element.endX, element.endY);
  ctx.stroke();
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  if (element.endX === undefined || element.endY === undefined) return;
  
  // Draw the line
  drawLine(ctx, element);
  
  // Draw arrowhead
  const angle = Math.atan2(element.endY - element.y, element.endX - element.x);
  
  ctx.beginPath();
  ctx.moveTo(element.endX, element.endY);
  ctx.lineTo(
    element.endX - ARROW_LENGTH * Math.cos(angle - ARROW_ANGLE),
    element.endY - ARROW_LENGTH * Math.sin(angle - ARROW_ANGLE)
  );
  ctx.moveTo(element.endX, element.endY);
  ctx.lineTo(
    element.endX - ARROW_LENGTH * Math.cos(angle + ARROW_ANGLE),
    element.endY - ARROW_LENGTH * Math.sin(angle + ARROW_ANGLE)
  );
  ctx.stroke();
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  if (!element.text) return;
  
  ctx.fillStyle = element.color;
  ctx.font = `${element.strokeWidth + 14}px Arial`;
  ctx.fillText(element.text, element.x, element.y);
};

export const drawElement = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  // Set up drawing context
  ctx.strokeStyle = element.color;
  ctx.fillStyle = element.fillColor || 'transparent';
  ctx.lineWidth = element.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (element.type) {
    case 'rectangle':
      drawRectangle(ctx, element);
      break;
    case 'circle':
      drawCircle(ctx, element);
      break;
    case 'line':
      drawLine(ctx, element);
      break;
    case 'arrow':
      drawArrow(ctx, element);
      break;
    case 'text':
      drawText(ctx, element);
      break;
  }
};

export const drawSelection = (
  ctx: CanvasRenderingContext2D,
  element: CanvasElement
): void => {
  ctx.strokeStyle = SELECTION_COLOR;
  ctx.lineWidth = 2;
  ctx.setLineDash(SELECTION_DASH);
  
  if (element.type === 'rectangle' && element.width && element.height) {
    ctx.strokeRect(
      element.x - 2, 
      element.y - 2, 
      element.width + 4, 
      element.height + 4
    );
  } else if (element.type === 'circle' && element.width) {
    const radius = element.width / 2;
    ctx.beginPath();
    ctx.arc(element.x + radius, element.y + radius, radius + 2, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
};