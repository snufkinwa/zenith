import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useIdleTimer } from 'react-idle-timer';

interface PomodoroState {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
  tabSwitchCount: number;
  totalFocusTime: number;
  showFocusWarning: boolean;
  isTabVisible: boolean;
  isPausedByIdle: boolean;
  idleTime: number;
  lastActiveTime: number;
  showIdleWarning: boolean;
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

  // Idle timer methods
  getRemainingIdleTime: () => number;
  getIdleTime: () => number;
  isIdle: () => boolean;
  resetIdleTimer: () => void;
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

export const PomodoroProvider: React.FC<PomodoroProviderProps> = ({
  children,
}) => {
  // Timer durations
  const WORK_DURATION = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60; // 5 minutes
  const LONG_BREAK = 15 * 60; // 15 minutes
  const IDLE_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds
  const IDLE_WARNING_TIME = 30 * 1000; // 30 seconds warning

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
    isPausedByIdle: false,
    idleTime: 0,
    lastActiveTime: Date.now(),
    showIdleWarning: false,
  });

  const [selectedColor, setSelectedColor] = useState('#ffeb3b');
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  const [wasActiveBeforeIdle, setWasActiveBeforeIdle] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const focusStartTime = useRef<number>(Date.now());
  const idleWarningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Idle timer handlers
  const handleOnIdle = () => {
    console.log('🥱 User went idle');

    // Only pause if timer was active during work session (not during breaks)
    if (pomodoroState.isActive && !pomodoroState.isBreak) {
      setWasActiveBeforeIdle(true);
      setPomodoroState((prev) => ({
        ...prev,
        isPausedByIdle: true,
        isActive: false,
        showFocusWarning: true,
        showIdleWarning: false,
      }));

      // Show notification
      showBrowserNotification(
        '⏸️ Timer Auto-Paused',
        'Your Pomodoro was paused due to inactivity. Move your mouse or press a key to resume!',
      );

      // Play notification sound
      playNotificationSound(600, 'square'); // Different tone for idle
    }
  };

  const handleOnActive = () => {
    console.log('🎯 User became active again');

    setPomodoroState((prev) => ({
      ...prev,
      lastActiveTime: Date.now(),
      showFocusWarning: false,
      showIdleWarning: false,
    }));

    // Clear idle warning timeout
    if (idleWarningTimeoutRef.current) {
      clearTimeout(idleWarningTimeoutRef.current);
      idleWarningTimeoutRef.current = null;
    }

    // Auto-resume if timer was paused by idle during work session
    if (
      pomodoroState.isPausedByIdle &&
      wasActiveBeforeIdle &&
      !pomodoroState.isBreak
    ) {
      setTimeout(() => {
        setPomodoroState((prev) => ({
          ...prev,
          isActive: true,
          isPausedByIdle: false,
        }));
        setWasActiveBeforeIdle(false);

        showBrowserNotification(
          '▶️ Timer Auto-Resumed',
          'Welcome back! Your Pomodoro has been automatically resumed.',
        );

        playNotificationSound(800, 'sine'); // Success tone
      }, 500); // Small delay to avoid immediate triggers
    }
  };

  const handleOnAction = () => {
    // Reset any warnings on user action
    if (pomodoroState.showIdleWarning) {
      setPomodoroState((prev) => ({ ...prev, showIdleWarning: false }));
    }

    // Clear warning timeout
    if (idleWarningTimeoutRef.current) {
      clearTimeout(idleWarningTimeoutRef.current);
      idleWarningTimeoutRef.current = null;
    }

    // Set up new warning timeout (30 seconds before idle)
    if (
      pomodoroState.isActive &&
      !pomodoroState.isBreak &&
      !pomodoroState.isPausedByIdle
    ) {
      idleWarningTimeoutRef.current = setTimeout(() => {
        setPomodoroState((prev) => ({ ...prev, showIdleWarning: true }));
      }, IDLE_TIMEOUT - IDLE_WARNING_TIME);
    }
  };

  // Initialize idle timer
  const {
    getRemainingTime,
    getLastActiveTime,
    getIdleTime,
    isIdle,
    reset: resetIdleTimer,
  } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
    crossTab: true,
    startOnMount: true,
    stopOnIdle: false,
    // Only track during work sessions, not breaks
    disabled: pomodoroState.isBreak || !pomodoroState.isActive,
  });

  // Enhanced page leave prevention
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setPomodoroState((prev) => ({ ...prev, isTabVisible: isVisible }));

      if (
        !isVisible &&
        pomodoroState.isActive &&
        !pomodoroState.isBreak &&
        isFocusLocked
      ) {
        // User switched away during active work session
        setPomodoroState((prev) => ({
          ...prev,
          tabSwitchCount: prev.tabSwitchCount + 1,
          showFocusWarning: true,
        }));

        // More persistent warning for tab switching
        setTimeout(() => {
          if (document.hidden) {
            showBrowserNotification(
              '🚨 Focus Broken!',
              'You switched tabs during an active Pomodoro session. Come back to maintain focus!',
            );
          }
        }, 2000);

        // Auto-hide warning after they return
        setTimeout(() => {
          setPomodoroState((prev) => ({ ...prev, showFocusWarning: false }));
        }, 5000);
      } else if (isVisible && pomodoroState.isActive) {
        // User returned to tab - reset idle timer
        resetIdleTimer();
        focusStartTime.current = Date.now();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pomodoroState.isActive && !pomodoroState.isBreak && isFocusLocked) {
        const message =
          '🍅 Focus session in progress! Leaving now will break your Pomodoro streak and reset your progress. Are you sure?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Prevent back button navigation during focus lock
    const handlePopState = (e: PopStateEvent) => {
      if (pomodoroState.isActive && !pomodoroState.isBreak && isFocusLocked) {
        e.preventDefault();

        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);

        // Show warning
        const shouldLeave = window.confirm(
          "🍅 You're in an active Pomodoro session! Navigating away will break your focus. Are you sure you want to continue?",
        );

        if (shouldLeave) {
          // User confirmed they want to leave
          setIsFocusLocked(false);
          setPomodoroState((prev) => ({ ...prev, isActive: false }));
          window.history.back();
        }
      }
    };

    // Add state to prevent back navigation
    if (pomodoroState.isActive && !pomodoroState.isBreak && isFocusLocked) {
      window.history.pushState(null, '', window.location.href);
    }

    // Add global event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [
    pomodoroState.isActive,
    pomodoroState.isBreak,
    isFocusLocked,
    resetIdleTimer,
  ]);

  // Track focus time (only when not idle)
  useEffect(() => {
    if (
      pomodoroState.isActive &&
      pomodoroState.isTabVisible &&
      !pomodoroState.isBreak &&
      !isIdle() &&
      !pomodoroState.isPausedByIdle
    ) {
      const focusInterval = setInterval(() => {
        setPomodoroState((prev) => ({
          ...prev,
          totalFocusTime: prev.totalFocusTime + 1,
          lastActiveTime: Date.now(),
        }));
      }, 1000);

      return () => clearInterval(focusInterval);
    }
  }, [
    pomodoroState.isActive,
    pomodoroState.isTabVisible,
    pomodoroState.isBreak,
    isIdle,
    pomodoroState.isPausedByIdle,
  ]);

  // Update idle time in state
  useEffect(() => {
    const idleUpdateInterval = setInterval(() => {
      setPomodoroState((prev) => ({
        ...prev,
        idleTime: Math.floor(getIdleTime() / 1000),
      }));
    }, 1000);

    return () => clearInterval(idleUpdateInterval);
  }, [getIdleTime]);

  // Main timer logic (enhanced with idle pause)
  useEffect(() => {
    if (
      pomodoroState.isActive &&
      pomodoroState.timeLeft > 0 &&
      !pomodoroState.isPausedByIdle
    ) {
      intervalRef.current = setInterval(() => {
        setPomodoroState((prev) => {
          if (prev.timeLeft <= 1) {
            // Timer completed - reset idle timer for next session
            resetIdleTimer();

            if (prev.isBreak) {
              // Break finished, start new work session
              playNotificationSound(800, 'sine');
              showBrowserNotification(
                'Break over!',
                'Time to get back to coding! 💪',
              );
              return {
                ...prev,
                isBreak: false,
                timeLeft: WORK_DURATION,
                isPausedByIdle: false,
                showIdleWarning: false,
              };
            } else {
              // Work session finished
              const newSessionCount = prev.sessionCount + 1;
              const breakDuration =
                newSessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;

              playNotificationSound(1000, 'sine');
              showBrowserNotification(
                'Pomodoro Complete!',
                `Excellent work! Take a ${breakDuration === LONG_BREAK ? 'long' : 'short'} break. 🎉`,
              );

              return {
                ...prev,
                sessionCount: newSessionCount,
                isBreak: true,
                timeLeft: breakDuration,
                isPausedByIdle: false,
                showIdleWarning: false,
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
  }, [
    pomodoroState.isActive,
    pomodoroState.timeLeft,
    pomodoroState.isPausedByIdle,
    resetIdleTimer, 
    LONG_BREAK,
    SHORT_BREAK,
    WORK_DURATION
  ]);

  // Cleanup idle warning timeout
  useEffect(() => {
    return () => {
      if (idleWarningTimeoutRef.current) {
        clearTimeout(idleWarningTimeoutRef.current);
      }
    };
  }, []);

  // Utility functions
  const playNotificationSound = (
    frequency: number = 800,
    type: OscillatorType = 'sine',
  ) => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const showBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true, // Keep notification until user interacts
        tag: 'pomodoro-notification', // Replace previous notifications
      });

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showBrowserNotification(
            '🍅 Notifications Enabled!',
            "You'll receive alerts for timer events and focus breaks.",
          );
        }
      });
    }
  };

  // Actions
  const startTimer = () => {
    requestNotificationPermission();
    resetIdleTimer(); // Reset idle timer when starting
    setPomodoroState((prev) => ({
      ...prev,
      isActive: true,
      isPausedByIdle: false,
      lastActiveTime: Date.now(),
      showIdleWarning: false,
    }));
    setIsFocusLocked(true);
    setWasActiveBeforeIdle(false);
    focusStartTime.current = Date.now();
  };

  const pauseTimer = () => {
    setPomodoroState((prev) => ({
      ...prev,
      isActive: false,
      isPausedByIdle: false,
      showIdleWarning: false,
    }));
    setIsFocusLocked(false);
    setWasActiveBeforeIdle(false);

    // Clear warning timeout
    if (idleWarningTimeoutRef.current) {
      clearTimeout(idleWarningTimeoutRef.current);
      idleWarningTimeoutRef.current = null;
    }
  };

  const resetTimer = () => {
    const duration = pomodoroState.isBreak
      ? pomodoroState.sessionCount % 4 === 0
        ? LONG_BREAK
        : SHORT_BREAK
      : WORK_DURATION;

    setPomodoroState((prev) => ({
      ...prev,
      timeLeft: duration,
      isActive: false,
      isPausedByIdle: false,
      showFocusWarning: false,
      showIdleWarning: false,
    }));

    setIsFocusLocked(false);
    resetIdleTimer();
    setWasActiveBeforeIdle(false);

    // Clear warning timeout
    if (idleWarningTimeoutRef.current) {
      clearTimeout(idleWarningTimeoutRef.current);
      idleWarningTimeoutRef.current = null;
    }
  };

  const requestFocusLock = () => {
    if (pomodoroState.isActive && !pomodoroState.isBreak) {
      setIsFocusLocked(true);
      resetIdleTimer();
    }
  };

  const releaseFocusLock = () => {
    setIsFocusLocked(false);
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusScore = () => {
    if (pomodoroState.totalFocusTime === 0) return 100;
    const distractionRatio =
      (pomodoroState.tabSwitchCount * 30 + pomodoroState.idleTime) /
      pomodoroState.totalFocusTime;
    return Math.max(0, Math.round(100 - distractionRatio * 100));
  };

  const contextValue: PomodoroContextType = {
    pomodoroState,
    selectedColor,
    isHighlightMode: false,
    startTimer,
    pauseTimer,
    resetTimer,
    setSelectedColor,
    isFocusLocked,
    requestFocusLock,
    releaseFocusLock,
    getRemainingIdleTime: () =>
      Math.max(0, Math.floor(getRemainingTime() / 1000)),
    getIdleTime: () => Math.floor(getIdleTime() / 1000),
    isIdle,
    resetIdleTimer,
  };

  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}

      {/* Enhanced Global Focus Warning Overlay */}
      {pomodoroState.showFocusWarning && (
        <div className="animate-slide-in fixed right-4 top-4 z-[99999]">
          <div className="max-w-sm rounded-lg border-l-4 border-yellow-600 bg-yellow-500 px-4 py-3 text-white shadow-lg">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">
                  {pomodoroState.isPausedByIdle
                    ? '⏸️ Timer Auto-Paused'
                    : '🚨 Focus Broken!'}
                </h4>
                <p className="mt-1 text-xs">
                  {pomodoroState.isPausedByIdle
                    ? 'You went idle. Move your mouse or press a key to resume.'
                    : 'Tab switching detected during active session. This affects your focus score.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idle Warning Overlay */}
      {pomodoroState.showIdleWarning && !pomodoroState.isPausedByIdle && (
        <div className="fixed left-1/2 top-4 z-[99999] -translate-x-1/2 transform animate-pulse">
          <div className="rounded-lg border-l-4 border-orange-600 bg-orange-500 px-4 py-3 text-white shadow-lg">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold">💤 Idle Warning</h4>
                <p className="text-xs">
                  Move your mouse or press a key to stay active! Timer will
                  pause in {contextValue.getRemainingIdleTime()}s
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mini Status Widget */}
      {pomodoroState.isActive && (
        <div className="fixed bottom-14 right-4 z-[9999]">
          <div
            className={`min-w-[200px] rounded-lg border-2 bg-white p-3 shadow-lg ${
              pomodoroState.isPausedByIdle
                ? 'border-blue-400'
                : pomodoroState.isBreak
                  ? 'border-green-400'
                  : 'border-red-400'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  pomodoroState.isPausedByIdle
                    ? 'animate-pulse bg-blue-500'
                    : pomodoroState.isBreak
                      ? 'bg-green-500'
                      : 'bg-red-500'
                }`}
              ></div>
              <span className="text-xs font-medium text-gray-700">
                {pomodoroState.isPausedByIdle
                  ? 'PAUSED'
                  : pomodoroState.isBreak
                    ? 'BREAK'
                    : 'FOCUS'}
              </span>
              {isFocusLocked && <span className="text-xs">🔒</span>}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span
                  className={`font-mono font-bold ${
                    pomodoroState.isPausedByIdle
                      ? 'text-blue-600'
                      : pomodoroState.isBreak
                        ? 'text-green-600'
                        : 'text-red-600'
                  }`}
                >
                  {formatTime(pomodoroState.timeLeft)}
                </span>
              </div>

              {!pomodoroState.isBreak && !pomodoroState.isPausedByIdle && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Idle in:</span>
                  <span className="font-mono text-xs text-orange-600">
                    {formatTime(contextValue.getRemainingIdleTime())}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Sessions:</span>
                <span className="font-medium">
                  {pomodoroState.sessionCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Focus Score:</span>
                <span className="font-medium">{getFocusScore()}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PomodoroContext.Provider>
  );
};
