"use client";

import { motion } from 'framer-motion';
import { CalculatorMode, Currency } from '../types/calculator';
import ModeSelector from './ModeSelector';

interface CalculatorFormProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  principal: string;
  onPrincipalChange: (value: string) => void;
  interest: string;
  onInterestChange: (value: string) => void;
  time: string;
  onTimeChange: (value: string) => void;
  emi: string;
  onEmiChange: (value: string) => void;
  onCalculate: () => void;
  selectedCurrency: Currency;
  theme: string;
}

export default function CalculatorForm({
  mode,
  onModeChange,
  principal,
  onPrincipalChange,
  interest,
  onInterestChange,
  time,
  onTimeChange,
  emi,
  onEmiChange,
  onCalculate,
  selectedCurrency,
  theme,
}: CalculatorFormProps) {
  return (
    <motion.div
      className={`rounded-2xl shadow-lg backdrop-blur-sm p-8 mb-8 ${
        theme === 'dark' 
          ? 'bg-gray-800/90 ring-1 ring-gray-700' 
          : 'bg-white/90 ring-1 ring-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ModeSelector
        mode={mode}
        onModeChange={onModeChange}
        theme={theme}
      />

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Principal Amount
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {selectedCurrency.symbol}
            </span>
            <input
              type="number"
              value={principal}
              onChange={(e) => onPrincipalChange(e.target.value)}
              className={`block w-full pl-8 pr-4 py-2.5 text-sm rounded-lg border transition-colors duration-200 focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Interest Rate
          </label>
          <div className="relative">
            <input
              type="number"
              value={interest}
              onChange={(e) => onInterestChange(e.target.value)}
              className={`block w-full pl-4 pr-12 py-2.5 text-sm rounded-lg border transition-colors duration-200 focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Enter rate"
              step="0.01"
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              % p.a.
            </span>
          </div>
        </div>

        {mode === 'emi' ? (
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Loan Term
            </label>
            <div className="relative">
              <input
                type="number"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                className={`block w-full pl-4 pr-16 py-2.5 text-sm rounded-lg border transition-colors duration-200 focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter years"
                step="0.1"
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                years
              </span>
            </div>
          </div>
        ) : (
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Monthly EMI
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {selectedCurrency.symbol}
              </span>
              <input
                type="number"
                value={emi}
                onChange={(e) => onEmiChange(e.target.value)}
                className={`block w-full pl-8 pr-4 py-2.5 text-sm rounded-lg border transition-colors duration-200 focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter EMI amount"
              />
            </div>
          </div>
        )}

        <motion.button
          onClick={onCalculate}
          className={`w-full py-3 px-4 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Calculate
        </motion.button>
      </div>
    </motion.div>
  );
}
