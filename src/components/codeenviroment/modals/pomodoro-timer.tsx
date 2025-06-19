import React from 'react';
import { Play, Pause, RotateCcw, Timer, AlertTriangle, Coffee, Target } from 'lucide-react';
import { usePomodoro } from '@/contexts/PomodoroContext'; // Adjust import path as needed

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
  onBreakComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  onSessionComplete, 
  onBreakComplete 
}) => {
  const { 
    pomodoroState, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    isFocusLocked 
  } = usePomodoro();

  // Timer durations for progress calculation
  const WORK_DURATION = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60;   // 5 minutes  
  const LONG_BREAK = 15 * 60;   // 15 minutes

  // Utility functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFocusTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getFocusScore = () => {
    if (pomodoroState.totalFocusTime === 0) return 100;
    const distractionRatio = (pomodoroState.tabSwitchCount * 30) / pomodoroState.totalFocusTime;
    return Math.max(0, Math.round(100 - (distractionRatio * 100)));
  };

  const getCurrentSessionDuration = () => {
    if (pomodoroState.isBreak) {
      return pomodoroState.sessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
    }
    return WORK_DURATION;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Timer className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-800">
            {pomodoroState.isBreak ? 'Break Time' : 'Focus Time'}
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          {pomodoroState.isBreak ? 'Take a well-deserved break!' : 'Stay focused on your coding!'}
        </p>
      </div>

      {/* Global Focus Status */}
      {isFocusLocked && pomodoroState.isActive && !pomodoroState.isBreak && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">🔒 Global Focus Mode Active</p>
              <p className="text-xs text-red-700">
                Entire application is locked! Tab switching is being monitored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Focus Warning */}
      {pomodoroState.showFocusWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Stay Focused!</p>
              <p className="text-xs text-yellow-700">
                You switched tabs during your focus session. This affects your global focus score.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-mono font-bold mb-2 ${
          pomodoroState.isBreak ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatTime(pomodoroState.timeLeft)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              pomodoroState.isBreak ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{
              width: `${100 - (pomodoroState.timeLeft / getCurrentSessionDuration()) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={pomodoroState.isActive ? pauseTimer : startTimer}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            pomodoroState.isActive 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {pomodoroState.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {pomodoroState.isActive ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Sessions Completed</span>
          </div>
          <span className="font-bold text-blue-600">{pomodoroState.sessionCount}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Focus Time</span>
          </div>
          <span className="font-bold text-green-600">{formatFocusTime(pomodoroState.totalFocusTime)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Tab Switches</span>
          </div>
          <span className="font-bold text-yellow-600">{pomodoroState.tabSwitchCount}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Global Focus Score</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                style={{ width: `${getFocusScore()}%` }}
              />
            </div>
            <span className="font-bold text-gray-700">{getFocusScore()}%</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Global Focus Mode:</strong> {pomodoroState.isActive && !pomodoroState.isBreak 
            ? "The entire application is locked to prevent distractions. Focus indicators appear globally!" 
            : "Start a session to enable global focus lock across the entire application."}
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;