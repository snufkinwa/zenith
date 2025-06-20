'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  icon?: React.ReactNode;
  zIndex?: number;
  onBringToFront?: () => void;
}

const DraggableModal: React.FC<ModalProps> = ({ 
  title, 
  isOpen, 
  onClose, 
  children, 
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 500 },
  icon,
  zIndex = 1000,
  onBringToFront
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState({ position: initialPosition, size: initialSize });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startMouseX: number; startMouseY: number } | null>(null);
  const resizeRef = useRef<{ startWidth: number; startHeight: number; startMouseX: number; startMouseY: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const deltaX = e.clientX - dragRef.current.startMouseX;
        const deltaY = e.clientY - dragRef.current.startMouseY;
        
        setPosition({
          x: Math.max(0, dragRef.current.startX + deltaX),
          y: Math.max(0, dragRef.current.startY + deltaY),
        });
      }
      
      if (isResizing && resizeRef.current) {
        const deltaX = e.clientX - resizeRef.current.startMouseX;
        const deltaY = e.clientY - resizeRef.current.startMouseY;
        
        setSize({
          width: Math.max(300, resizeRef.current.startWidth + deltaX),
          height: Math.max(200, resizeRef.current.startHeight + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragRef.current = null;
      resizeRef.current = null;
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      dragRef.current = {
        startX: position.x,
        startY: position.y,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
      };
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startWidth: size.width,
      startHeight: size.height,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    };
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition(previousState.position);
      setSize(previousState.size);
      setIsMaximized(false);
    } else {
      setPreviousState({ position, size });
      setPosition({ x: 20, y: 20 });
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setIsMaximized(true);
    }
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: zIndex,
  };

  return (
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={modalStyle}
      onClick={onBringToFront}
    >
      {/* Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMaximize}
            className="p-1.5 hover:bg-gray-200 rounded text-black transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded text-black transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="h-full overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {children}
      </div>
      
      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          onMouseDown={handleResizeMouseDown}
          style={{
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          }}
        />
      )}
    </div>
  );
};

export default DraggableModal