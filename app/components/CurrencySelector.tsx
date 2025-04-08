"use client";

import { Currency } from '../types/calculator';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  currencies: Currency[];
  theme: string;
}

export default function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  currencies,
  theme,
}: CurrencySelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedCurrency.code}
        onChange={(e) => {
          const currency = currencies.find(c => c.code === e.target.value);
          if (currency) onCurrencyChange(currency);
        }}
        className={`appearance-none block w-48 px-4 py-2.5 text-sm rounded-lg border shadow-sm transition-all duration-200 focus:ring-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:border-blue-500 focus:ring-blue-500'
            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus:border-blue-500 focus:ring-blue-500'
        }`}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} - {currency.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5">
        <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
