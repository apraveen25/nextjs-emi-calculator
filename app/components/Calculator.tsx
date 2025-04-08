"use client";

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import * as XLSX from 'xlsx';
import { CalculatorMode, Currency, EMIDetail, currencies } from '../types/calculator';
import { calculateEMIDetails, calculateMonthlyEMI, calculateLoanTerm } from '../utils/calculator';
import CurrencySelector from './CurrencySelector';
import CalculatorForm from './CalculatorForm';
import EMIResults from './EMIResults';

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
    const r = parseFloat(interest);
    const t = parseFloat(time);
    
    const monthlyEmi = calculateMonthlyEMI(p, r, t);
    setEmi(monthlyEmi.toFixed(2));
    
    const details = calculateEMIDetails(p, r / (12 * 100), t * 12, monthlyEmi);
    setEmiDetails(details);
  };

  const calculateTimeframe = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest);
    const e = parseFloat(emi);
    
    const months = calculateLoanTerm(p, r, e);
    setTime((months / 12).toFixed(2));
    
    const details = calculateEMIDetails(p, r / (12 * 100), Math.ceil(months), e);
    setEmiDetails(details);
  };

  const handleDownloadExcel = () => {
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

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } };
    ws['!merges'] = [mergeRange];

    const max_width = worksheetData.reduce((w, r) => Math.max(w, r.length), 0);
    const wscols = Array(max_width).fill({ wch: 15 });
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
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              currencies={currencies}
              theme={theme}
            />
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

        <CalculatorForm
          mode={mode}
          onModeChange={setMode}
          principal={principal}
          onPrincipalChange={setPrincipal}
          interest={interest}
          onInterestChange={setInterest}
          time={time}
          onTimeChange={setTime}
          emi={emi}
          onEmiChange={setEmi}
          onCalculate={handleCalculate}
          selectedCurrency={selectedCurrency}
          theme={theme}
        />

        <EMIResults
          emiDetails={emiDetails}
          theme={theme}
          selectedCurrency={selectedCurrency}
          onDownloadExcel={handleDownloadExcel}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
