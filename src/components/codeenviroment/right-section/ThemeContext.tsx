import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  getThemeClasses: () => {
    // Editor colors
    editorBg: string;
    editorHeaderBg: string;
    editorHeaderBorder: string;
    editorHeaderText: string;
    editorToggleButton: string;
    editorLanguageIndicator: string;
    
    // Terminal colors - much darker in dark mode
    terminalBg: string;
    terminalHeaderBg: string;
    terminalHeaderBorder: string;
    terminalHeaderText: string;
    terminalTabActive: string;
    terminalTabInactive: string;
    terminalText: string;
    terminalInputBg: string;
    terminalInputBorder: string;
    terminalInputText: string;
    
    // Shared colors
    iconColor: string;
    borderColor: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('editor-theme') === 'dark';
    }
    return false;
  });

  // Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'editor-theme') {
        setIsDarkMode(e.newValue === 'dark');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('editor-theme', newMode ? 'dark' : 'light');
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'editor-theme',
      newValue: newMode ? 'dark' : 'light',
    }));
  };

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        // Editor colors (current implementation)
        editorBg: 'bg-[#1a1b26]',
        editorHeaderBg: 'bg-gray-800',
        editorHeaderBorder: 'border-gray-700',
        editorHeaderText: 'text-gray-100',
        editorToggleButton: 'bg-[#414868] hover:bg-[#4a5574] text-gray-300',
        editorLanguageIndicator: 'bg-blue-900 text-blue-200',
        
        // Terminal colors - much darker for consistency
        terminalBg: 'bg-[#0d1117]', // Much darker than editor
        terminalHeaderBg: 'bg-[#161b22]', // Darker header
        terminalHeaderBorder: 'border-gray-800',
        terminalHeaderText: 'text-gray-100',
        terminalTabActive: 'bg-[#21262d] text-blue-400 shadow-sm border border-gray-700',
        terminalTabInactive: 'text-gray-300 hover:text-gray-100 hover:bg-[#21262d]',
        terminalText: 'text-gray-100', // Light text for dark background
        terminalInputBg: 'bg-[#21262d]',
        terminalInputBorder: 'border-gray-600',
        terminalInputText: 'text-gray-100',
        
        // Shared colors
        iconColor: 'text-gray-300',
        borderColor: 'border-gray-700',
      };
    } else {
      return {
        // Editor colors (keep current light implementation)
        editorBg: 'bg-[#d5d6db]',
        editorHeaderBg: 'bg-gray-50',
        editorHeaderBorder: 'border-gray-200',
        editorHeaderText: 'text-gray-900',
        editorToggleButton: 'bg-[#c4c8da] hover:bg-[#b6bbd0] text-[#33467c]',
        editorLanguageIndicator: 'bg-blue-100 text-blue-800',
        
        // Terminal colors - current light colors but with black text
        terminalBg: 'bg-white',
        terminalHeaderBg: 'bg-gray-50',
        terminalHeaderBorder: 'border-gray-200',
        terminalHeaderText: 'text-gray-900', // Black text for light mode
        terminalTabActive: 'bg-white text-blue-600 shadow-sm border border-gray-200',
        terminalTabInactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        terminalText: 'text-gray-900', // Black text for light background
        terminalInputBg: 'bg-white',
        terminalInputBorder: 'border-gray-200',
        terminalInputText: 'text-gray-900',
        
        // Shared colors
        iconColor: 'text-gray-600',
        borderColor: 'border-gray-200',
      };
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, getThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};