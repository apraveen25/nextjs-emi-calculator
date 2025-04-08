"use client";

import { motion } from 'framer-motion';
import { EMIDetail, Currency } from '../types/calculator';
import EMICharts from './EMICharts';

interface EMIResultsProps {
  emiDetails: EMIDetail[];
  theme: 'dark' | 'light';
  selectedCurrency: Currency;
  onDownloadExcel: () => void;
  formatCurrency: (amount: number) => string;
}

export default function EMIResults({
  emiDetails,
  theme,
  selectedCurrency,
  onDownloadExcel,
  formatCurrency,
}: EMIResultsProps) {
  if (emiDetails.length === 0) return null;

  return (
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
          onClick={onDownloadExcel}
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
  );
}
