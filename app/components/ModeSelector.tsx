"use client";

import { CalculatorMode } from '../types/calculator';

interface ModeSelectorProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  theme: string;
}

export default function ModeSelector({
  mode,
  onModeChange,
  theme,
}: ModeSelectorProps) {
  return (
    <div className={`inline-flex p-1 rounded-lg mb-8 ${
      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      <button
        onClick={() => onModeChange('emi')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          mode === 'emi'
            ? theme === 'dark'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-blue-600 shadow-lg'
            : theme === 'dark'
            ? 'text-gray-300 hover:text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Calculate EMI
      </button>
      <button
        onClick={() => onModeChange('timeframe')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          mode === 'timeframe'
            ? theme === 'dark'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-blue-600 shadow-lg'
            : theme === 'dark'
            ? 'text-gray-300 hover:text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Calculate Time
      </button>
    </div>
  );
}
