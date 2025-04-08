"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import * as XLSX from 'xlsx';
import EMICharts from './EMICharts';

type CalculatorMode = 'emi' | 'timeframe';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

export interface EMIDetail {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, x: 20 }
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
};

const tableAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Calculator() {
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<CalculatorMode>('emi');
  const [principal, setPrincipal] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [emi, setEmi] = useState<string>('');
  const [emiDetails, setEmiDetails] = useState<EMIDetail[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCalculate = () => {
    if (mode === 'emi') {
      calculateEMI();
    } else {
      calculateTimeframe();
    }
  };

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / (12 * 100); // monthly interest rate
    const t = parseFloat(time) * 12; // time in months
    
    const monthlyEmi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
    setEmi(monthlyEmi.toFixed(2));
    
    // Calculate EMI details
    const details = calculateEMIDetails(p, r, t, monthlyEmi);
    setEmiDetails(details);
  };

  const calculateTimeframe = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / (12 * 100); // monthly interest rate
    const e = parseFloat(emi);
    
    const t = Math.log(e / (e - p * r)) / Math.log(1 + r);
    setTime((t / 12).toFixed(2));
    
    // Calculate EMI details
    const details = calculateEMIDetails(p, r, Math.ceil(t), e);
    setEmiDetails(details);
  };

  const calculateEMIDetails = (p: number, r: number, t: number, monthlyEmi: number) => {
    let balance = p;
    const details: EMIDetail[] = [];
    for (let month = 1; month <= t; month++) {
      const monthlyInterest = balance * r;
      const monthlyPrincipal = monthlyEmi - monthlyInterest;
      balance = balance - monthlyPrincipal;
      details.push({
        month,
        emi: monthlyEmi,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        balance: Math.max(0, balance)
      });
    }
    return details;
  };

  const handleDownloadExcel = () => {
    // Create worksheet data with summary
    const worksheetData = [
      ['EMI Schedule'],
      [''],
      ['Loan Details'],
      ['Principal Amount', formatCurrency(parseFloat(principal))],
      ['Interest Rate', `${interest}% per annum`],
      mode === 'emi' 
        ? ['Loan Tenure', `${time} years`]
        : ['Monthly EMI', formatCurrency(parseFloat(emi))],
      [''],
      ['Monthly Breakdown'],
      ['Month', 'EMI', 'Principal', 'Interest', 'Balance'],
      ...emiDetails.map(detail => [
        detail.month,
        formatCurrency(detail.emi),
        formatCurrency(detail.principal),
        formatCurrency(detail.interest),
        formatCurrency(detail.balance)
      ]),
      [''],
      ['Summary'],
      ['Total Principal', formatCurrency(parseFloat(principal))],
      ['Total Interest', formatCurrency(emiDetails.reduce((sum, detail) => sum + detail.interest, 0))],
      ['Total Amount', formatCurrency(emiDetails.reduce((sum, detail) => sum + detail.emi, 0))]
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EMI Schedule');

    // Style the worksheet
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } };
    ws['!merges'] = [mergeRange];

    // Auto-size columns
    const max_width = worksheetData.reduce((w, r) => Math.max(w, r.length), 0);
    const wscols = Array(max_width).fill({ wch: 15 }); // Set column width to 15 characters
    ws['!cols'] = wscols;

    const fileName = `EMI_Schedule_${selectedCurrency.code}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className={`min-h-screen py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Currency Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-0 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            EMI Calculator
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedCurrency.code}
                onChange={(e) => setSelectedCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
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
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 focus:ring-yellow-500'
                  : 'bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
              }`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Calculator Form */}
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
          {/* Mode Selector */}
          <div className={`inline-flex p-1 rounded-lg mb-8 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setMode('emi')}
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
              onClick={() => setMode('timeframe')}
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

          {/* Input Fields */}
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
                  onChange={(e) => setPrincipal(e.target.value)}
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
                  onChange={(e) => setInterest(e.target.value)}
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
                    onChange={(e) => setTime(e.target.value)}
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
                    onChange={(e) => setEmi(e.target.value)}
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
              onClick={handleCalculate}
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

        {/* Results Section */}
        {emiDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                EMI Breakdown
              </h2>
              <motion.button
                onClick={handleDownloadExcel}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Excel
              </motion.button>
            </div>

            <EMICharts
              emiDetails={emiDetails}
              theme={theme}
              currency={selectedCurrency}
            />

            <div className="mt-6 overflow-x-auto">
              <table className={`min-w-full divide-y divide-gray-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}>
                <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Month</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">EMI</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Principal</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Interest</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {emiDetails.map((detail, index) => (
                    <tr key={detail.month} className={index % 2 === 0 ? theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{detail.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(detail.emi)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(detail.principal)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(detail.interest)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(detail.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
