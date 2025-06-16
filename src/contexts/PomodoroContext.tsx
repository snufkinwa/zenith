import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface PomodoroState {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
  tabSwitchCount: number;
  totalFocusTime: number;
  showFocusWarning: boolean;
  isTabVisible: boolean;
}

interface PomodoroContextType {
  // State
  pomodoroState: PomodoroState;
  selectedColor: string;
  isHighlightMode: boolean;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setSelectedColor: (color: string) => void;
  
  // Focus control
  isFocusLocked: boolean;
  requestFocusLock: () => void;
  releaseFocusLock: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | null>(null);

// Hook to use Pomodoro context
export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider');
  }
  return context;
};

// Global Pomodoro Provider
interface PomodoroProviderProps {
  children: ReactNode;
}

export const PomodoroProvider: React.FC<PomodoroProviderProps> = ({ children }) => {
  // Timer durations
  const WORK_DURATION = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60;   // 5 minutes
  const LONG_BREAK = 15 * 60;   // 15 minutes

  // Pomodoro state
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    timeLeft: WORK_DURATION,
    isActive: false,
    isBreak: false,
    sessionCount: 0,
    tabSwitchCount: 0,
    totalFocusTime: 0,
    showFocusWarning: false,
    isTabVisible: true,
  });

  const [selectedColor, setSelectedColor] = useState('#ffeb3b');
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const focusStartTime = useRef<number>(Date.now());

  // Global tab visibility and focus lock
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setPomodoroState(prev => ({ ...prev, isTabVisible: isVisible }));
      
      if (!isVisible && pomodoroState.isActive && !pomodoroState.isBreak) {
        // User switched away during active work session
        setPomodoroState(prev => ({
          ...prev,
          tabSwitchCount: prev.tabSwitchCount + 1,
          showFocusWarning: true
        }));
        
        // Auto-hide warning after 3 seconds when they return
        setTimeout(() => {
          setPomodoroState(prev => ({ ...prev, showFocusWarning: false }));
        }, 3000);
      } else if (isVisible && pomodoroState.isActive) {
        // User returned to tab
        focusStartTime.current = Date.now();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pomodoroState.isActive && !pomodoroState.isBreak && isFocusLocked) {
        const message = "🍅 Focus session in progress! Are you sure you want to leave and break your focus streak?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Add global event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pomodoroState.isActive, pomodoroState.isBreak, isFocusLocked]);

  // Track focus time
  useEffect(() => {
    if (pomodoroState.isActive && pomodoroState.isTabVisible && !pomodoroState.isBreak) {
      const focusInterval = setInterval(() => {
        setPomodoroState(prev => ({ ...prev, totalFocusTime: prev.totalFocusTime + 1 }));
      }, 1000);
      
      return () => clearInterval(focusInterval);
    }
  }, [pomodoroState.isActive, pomodoroState.isTabVisible, pomodoroState.isBreak]);

  // Main timer logic
  useEffect(() => {
    if (pomodoroState.isActive && pomodoroState.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setPomodoroState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer completed
            if (prev.isBreak) {
              // Break finished, start new work session
              playNotificationSound();
              showBrowserNotification('Break over!', 'Time to get back to coding! 💪');
              return {
                ...prev,
                isBreak: false,
                timeLeft: WORK_DURATION
              };
            } else {
              // Work session finished
              const newSessionCount = prev.sessionCount + 1;
              const breakDuration = newSessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
              
              playNotificationSound();
              showBrowserNotification(
                'Pomodoro Complete!', 
                `Great work! Take a ${breakDuration === LONG_BREAK ? 'long' : 'short'} break. 🎉`
              );
              
              return {
                ...prev,
                sessionCount: newSessionCount,
                isBreak: true,
                timeLeft: breakDuration
              };
            }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pomodoroState.isActive, pomodoroState.timeLeft]);

  // Utility functions
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const showBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Actions
  const startTimer = () => {
    setPomodoroState(prev => ({ ...prev, isActive: true }));
    setIsFocusLocked(true);
    focusStartTime.current = Date.now();
    requestNotificationPermission();
  };

  const pauseTimer = () => {
    setPomodoroState(prev => ({ ...prev, isActive: false }));
    setIsFocusLocked(false);
  };

  const resetTimer = () => {
    setPomodoroState({
      timeLeft: WORK_DURATION,
      isActive: false,
      isBreak: false,
      sessionCount: 0,
      tabSwitchCount: 0,
      totalFocusTime: 0,
      showFocusWarning: false,
      isTabVisible: true,
    });
    setIsFocusLocked(false);
  };

  const requestFocusLock = () => {
    if (pomodoroState.isActive && !pomodoroState.isBreak) {
      setIsFocusLocked(true);
    }
  };

  const releaseFocusLock = () => {
    setIsFocusLocked(false);
  };

  const contextValue: PomodoroContextType = {
    pomodoroState,
    selectedColor,
    isHighlightMode: false, // Can be expanded later
    startTimer,
    pauseTimer,
    resetTimer,
    setSelectedColor,
    isFocusLocked,
    requestFocusLock,
    releaseFocusLock,
  };

  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}
      {/* Global Focus Warning Overlay */}
      {pomodoroState.showFocusWarning && (
        <div className="fixed top-4 right-4 z-[99999] animate-slide-in">
          <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg border-l-4 border-yellow-600">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Stay Focused!</p>
                <p className="text-sm opacity-90">You switched tabs during your focus session</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Global Focus Lock Indicator */}
      {isFocusLocked && pomodoroState.isActive && !pomodoroState.isBreak && (
        <div className="fixed top-4 left-4 z-[99999]">
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">🔒 Focus Mode Active</span>
          </div>
        </div>
      )}
    </PomodoroContext.Provider>
  );
};

// Global Focus Stats Component
export const GlobalFocusStats: React.FC = () => {
  const { pomodoroState, isFocusLocked } = usePomodoro();

  if (!pomodoroState.isActive && pomodoroState.sessionCount === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusScore = () => {
    if (pomodoroState.totalFocusTime === 0) return 100;
    const distractionRatio = (pomodoroState.tabSwitchCount * 30) / pomodoroState.totalFocusTime;
    return Math.max(0, Math.round(100 - (distractionRatio * 100)));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[99998]">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Focus Session</span>
          <div className={`w-2 h-2 rounded-full ${pomodoroState.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Time Left:</span>
            <span className={`font-mono font-bold ${pomodoroState.isBreak ? 'text-green-600' : 'text-red-600'}`}>
              {formatTime(pomodoroState.timeLeft)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Sessions:</span>
            <span className="font-medium">{pomodoroState.sessionCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Focus Score:</span>
            <span className="font-medium">{getFocusScore()}%</span>
          </div>
          
          {pomodoroState.tabSwitchCount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Distractions:</span>
              <span className="text-yellow-600 font-medium">{pomodoroState.tabSwitchCount}</span>
            </div>
          )}
        </div>
        
        {pomodoroState.isBreak && (
          <div className="mt-2 text-center">
            <span className="text-xs text-green-600 font-medium">☕ Break Time</span>
          </div>
        )}
      </div>
    </div>
  );
};