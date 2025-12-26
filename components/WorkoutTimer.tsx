
import React, { useState, useEffect } from 'react';
import { Timer, X } from 'lucide-react';

interface WorkoutTimerProps {
  duration?: number; // seconds
  onClose: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ duration = 90, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-aura-surface border border-aura-blue/30 rounded-2xl p-4 flex items-center justify-between shadow-2xl z-50 animate-bounce-subtle">
      <div className="flex items-center gap-3">
        <div className="bg-aura-blue/20 p-2 rounded-full">
          <Timer className="w-5 h-5 text-aura-blue animate-pulse" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Descanso</p>
          <p className="text-xl font-bold font-mono">
            {mins}:{secs.toString().padStart(2, '0')}
          </p>
        </div>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
        <X className="w-5 h-5 text-gray-400" />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-aura-blue transition-all duration-1000" style={{ width: `${(timeLeft / duration) * 100}%` }} />
    </div>
  );
};

export default WorkoutTimer;
