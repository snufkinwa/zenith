// src/components/codeenviroment/modals/CanvasModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { PenTool, Save, Download, Trash2 } from 'lucide-react';
import DraggableModal from './DraggableModal';
import AlgorithmCanvas from './AlgorithmCanvas';

interface CanvasElement {
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

interface CanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
}

const CanvasModal: React.FC<CanvasModalProps> = ({ isOpen, onClose, zIndex, onBringToFront }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Save canvas data to localStorage
  const saveCanvas = () => {
    try {
      const canvasData = {
        elements,
        timestamp: Date.now()
      };
      localStorage.setItem('zenith-canvas-data', JSON.stringify(canvasData));
      setLastSaved(new Date());
      console.log('Canvas saved successfully!');
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  };

  // Load canvas data from localStorage
  const loadCanvas = () => {
    try {
      const savedData = localStorage.getItem('zenith-canvas-data');
      if (savedData) {
        const { elements: savedElements, timestamp } = JSON.parse(savedData);
        setElements(savedElements || []);
        setLastSaved(new Date(timestamp));
      }
    } catch (error) {
      console.error('Error loading canvas data:', error);
    }
  };

  // Export canvas as PNG
  const exportAsPNG = async () => {
    setIsExporting(true);
    try {
      // Create a temporary canvas for export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 600;
      
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all elements
      elements.forEach(element => {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.fillColor || 'transparent';
        ctx.lineWidth = element.strokeWidth;

        switch (element.type) {
          case 'rectangle':
            if (element.width && element.height) {
              ctx.beginPath();
              ctx.rect(element.x, element.y, element.width, element.height);
              if (element.fillColor && element.fillColor !== 'transparent') {
                ctx.fill();
              }
              ctx.stroke();
            }
            break;

          case 'circle':
            if (element.width) {
              const radius = element.width / 2;
              ctx.beginPath();
              ctx.arc(element.x + radius, element.y + radius, radius, 0, 2 * Math.PI);
              if (element.fillColor && element.fillColor !== 'transparent') {
                ctx.fill();
              }
              ctx.stroke();
            }
            break;

          case 'line':
            if (element.endX !== undefined && element.endY !== undefined) {
              ctx.beginPath();
              ctx.moveTo(element.x, element.y);
              ctx.lineTo(element.endX, element.endY);
              ctx.stroke();
            }
            break;

          case 'arrow':
            if (element.endX !== undefined && element.endY !== undefined) {
              // Draw line
              ctx.beginPath();
              ctx.moveTo(element.x, element.y);
              ctx.lineTo(element.endX, element.endY);
              ctx.stroke();

              // Draw arrowhead
              const angle = Math.atan2(element.endY - element.y, element.endX - element.x);
              const arrowLength = 15;
              const arrowAngle = Math.PI / 6;

              ctx.beginPath();
              ctx.moveTo(element.endX, element.endY);
              ctx.lineTo(
                element.endX - arrowLength * Math.cos(angle - arrowAngle),
                element.endY - arrowLength * Math.sin(angle - arrowAngle)
              );
              ctx.moveTo(element.endX, element.endY);
              ctx.lineTo(
                element.endX - arrowLength * Math.cos(angle + arrowAngle),
                element.endY - arrowLength * Math.sin(angle + arrowAngle)
              );
              ctx.stroke();
            }
            break;

          case 'text':
            if (element.text) {
              ctx.fillStyle = element.color;
              ctx.font = '16px Arial';
              ctx.fillText(element.text, element.x, element.y);
            }
            break;
        }
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `algorithm-diagram-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };


  // Load saved data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCanvas();
    }
  }, [isOpen]);

  // Auto-save every 30 seconds when there are changes
  useEffect(() => {
    if (isOpen && elements.length > 0) {
      const autoSaveInterval = setInterval(() => {
        saveCanvas();
      }, 30000);

      return () => clearInterval(autoSaveInterval);
    }
  }, [isOpen, elements]);

  return (
    <DraggableModal
      title="Algorithm Canvas"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 200, y: 100 }}
      initialSize={{ width: 900, height: 700 }}
      icon={<PenTool size={16} className="text-green-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="flex flex-col h-full">
        {/* Top Toolbar */}
        <div className="flex items-center justify-end px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
 
          
          <div className="flex items-center gap-2">
            {/* Last saved indicator */}
            {lastSaved && (
              <span className="text-xs text-gray-500 mr-2">
                Saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            {/* Action buttons */}
            <button
              onClick={saveCanvas}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
              title="Save Canvas"
            >
              <Save size={12} />
              Save
            </button>
            
            <button
              onClick={exportAsPNG}
              disabled={isExporting}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors disabled:opacity-50"
              title="Export as PNG"
            >
              <Download size={12} />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Canvas Component */}
        <div className="flex-1 overflow-hidden">
          <AlgorithmCanvas
            width={880} 
            height={620}
            onElementsChange={setElements}
            initialElements={elements}
          />
        </div>
      </div>
    </DraggableModal>
  );
};

export default CanvasModal;