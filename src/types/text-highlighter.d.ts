declare module '@perlego/text-highlighter' {
  interface HighlighterOptions {
    version?: string;
    useDefaultEvents?: boolean;
    onBeforeHighlight?: (range: Range) => boolean;
    onAfterHighlight?: (range: Range, descriptors: any[], timestamp: number, meta: any) => void;
    preprocessDescriptors?: (range: Range, descriptors: any[], timestamp: number) => { descriptors: any[], meta: any };
    onRemoveHighlight?: (highlightElement: HTMLElement) => boolean;
  }

  class TextHighlighter {
    constructor(element: HTMLElement, options?: HighlighterOptions);
    
    highlightHandler(): void;
    removeHighlights(element?: HTMLElement): void;
    deserializeHighlights(descriptors: any[]): void;
    serializeHighlights(): any[];
    destroy?(): void;
  }

  export default TextHighlighter;
}