import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Highlighter, Eye, EyeOff, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Highlight {
  id: string;
  text: string;
  color: string;
  startOffset: number;
  endOffset: number;
  timestamp: number;
}

interface HighlightableTextProps {
  content: string;
  problemId?: string;
  className?: string;
  isMarkdown?: boolean;
  onHighlightChange?: (highlights: Highlight[]) => void;
}

const HighlightableText: React.FC<HighlightableTextProps> = ({
  content,
  problemId = 'default',
  className = '',
  isMarkdown = false,
  onHighlightChange,
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedColor, setSelectedColor] = useState('#ffeb3b');
  const [showHighlights, setShowHighlights] = useState(true);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const colors = [
    { name: 'Yellow', value: '#ffeb3b' },
    { name: 'Green', value: '#4caf50' },
    { name: 'Blue', value: '#2196f3' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Pink', value: '#e91e63' },
  ];

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearExistingHighlights = useCallback(() => {
    if (!contentRef.current) return;
    const spans = contentRef.current.querySelectorAll('span.highlight-span');
    spans.forEach((span) => {
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize();
      }
    });
  }, []);

  const applyHighlights = useCallback(() => {
    clearExistingHighlights();
    if (!showHighlights || !contentRef.current || highlights.length === 0)
      return;

    const sorted = [...highlights].sort(
      (a, b) => b.startOffset - a.startOffset,
    );

    sorted.forEach((h) => {
      const walker = document.createTreeWalker(
        contentRef.current!,
        NodeFilter.SHOW_TEXT,
        null,
      );
      const range = document.createRange();

      let currentOffset = 0;
      let startNode: Node | null = null;
      let endNode: Node | null = null;
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const len = node.textContent?.length || 0;
        if (!startNode && currentOffset + len >= h.startOffset) {
          startNode = node;
          range.setStart(node, h.startOffset - currentOffset);
        }
        if (!endNode && currentOffset + len >= h.endOffset) {
          endNode = node;
          range.setEnd(node, h.endOffset - currentOffset);
          break;
        }
        currentOffset += len;
      }

      if (startNode && endNode) {
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'highlight-span cursor-pointer rounded';
        highlightSpan.style.backgroundColor = `${h.color}4D`;
        highlightSpan.style.borderBottom = `2px solid ${h.color}`;
        highlightSpan.setAttribute('data-highlight-id', h.id);
        highlightSpan.title = `Click to remove: "${h.text.substring(0, 50)}..."`;
        highlightSpan.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          removeHighlight(h.id);
        };
        try {
          const contents = range.extractContents();
          highlightSpan.appendChild(contents);
          range.insertNode(highlightSpan);
        } catch (err) {
          console.error('Error applying highlight:', err);
        }
      }
    });
  }, [highlights, showHighlights, clearExistingHighlights, removeHighlight]);

  useEffect(() => {
    clearExistingHighlights();
    const saved = localStorage.getItem(`highlights-${problemId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Highlight[];
        setHighlights(parsed);
      } catch (e) {
        console.error('Error loading highlights:', e);
        setHighlights([]);
      }
    } else {
      setHighlights([]);
    }
  }, [problemId, clearExistingHighlights]);

  useEffect(() => {
    localStorage.setItem(`highlights-${problemId}`, JSON.stringify(highlights));
    onHighlightChange?.(highlights);
  }, [highlights, problemId, onHighlightChange]);

  useEffect(() => {
    const timer = setTimeout(() => applyHighlights(), 0);
    return () => clearTimeout(timer);
  }, [content, applyHighlights, selectedColor, isHighlightMode]);

  const getTextOffset = useCallback(
    (rootNode: Node, targetNode: Node, offset: number): number => {
      let total = 0;
      const walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
      );
      let node;
      while ((node = walker.nextNode())) {
        if (node === targetNode) {
          return total + offset;
        }
        total += node.textContent?.length || 0;
      }
      return -1;
    },
    [],
  );

  const handleMouseUp = useCallback(() => {
    if (!isHighlightMode || !contentRef.current) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const selectedText = sel.toString().trim();
    if (!selectedText) return;

    const range = sel.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) {
      sel.removeAllRanges();
      return;
    }

    const start = getTextOffset(
      contentRef.current,
      range.startContainer,
      range.startOffset,
    );
    const end = getTextOffset(
      contentRef.current,
      range.endContainer,
      range.endOffset,
    );

    if (start === -1 || end === -1) {
      sel.removeAllRanges();
      return;
    }

    const overlap = highlights.some(
      (h) => start < h.endOffset && end > h.startOffset,
    );
    if (overlap) {
      window.alert(
        'Highlights cannot overlap. Please select a different area or remove the existing highlight first.',
      );
      sel.removeAllRanges();
      return;
    }

    const newHighlight: Highlight = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: selectedText,
      color: selectedColor,
      startOffset: start,
      endOffset: end,
      timestamp: Date.now(),
    };

    setHighlights((prev) => [...prev, newHighlight]);
    sel.removeAllRanges();
  }, [isHighlightMode, selectedColor, getTextOffset, highlights]);

  const clearAllHighlights = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all highlights?')) {
      setHighlights([]);
    }
  }, []);

  const renderContent = () => {
    if (isMarkdown) {
      return (
        <ReactMarkdown
          components={{
            code: ({ node, ...props }) => (
              <code
                className="rounded bg-gray-100 px-1 py-0.5 text-sm"
                {...props}
              />
            ),
            pre: ({ node, ...props }) => (
              <pre
                className="overflow-x-auto rounded bg-gray-100 p-3"
                {...props}
              />
            ),
            h1: ({ node, ...props }) => (
              <h1 className="mb-4 text-2xl font-bold" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="mb-3 text-xl font-semibold" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mb-2 text-lg font-medium" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-3 leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="mb-3 list-disc pl-5" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="mb-3 list-decimal pl-5" {...props} />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            strong: ({ node, ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
            em: ({ node, ...props }) => <em className="italic" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div className={`highlightable-text ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-y-2 rounded-lg border bg-gray-50 p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsHighlightMode(!isHighlightMode)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isHighlightMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Toggle highlight mode"
          >
            <Highlighter className="h-4 w-4" />
            <span>Highlight Mode</span>
          </button>

          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? 'scale-110 border-gray-800 ring-2 ring-blue-500 ring-offset-1'
                    : 'border-transparent hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHighlights(!showHighlights)}
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-200"
            title={showHighlights ? 'Hide highlights' : 'Show highlights'}
          >
            {showHighlights ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={clearAllHighlights}
            className="flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            title="Clear all highlights"
            disabled={highlights.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear ({highlights.length})</span>
          </button>
        </div>
      </div>

      <div
        ref={contentRef}
        onMouseUp={handleMouseUp}
        className={`prose max-w-none leading-relaxed ${isHighlightMode ? 'cursor-text' : ''}`}
        style={{
          userSelect: isHighlightMode ? 'text' : 'none',
          WebkitUserSelect: isHighlightMode ? 'text' : 'none',
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default HighlightableText;
