"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CalculatorMode = 'emi' | 'timeframe';

interface EMIDetail {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
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

const rowVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function Calculator() {
  const [mode, setMode] = useState<CalculatorMode>('emi');
  const [principal, setPrincipal] = useState('');
  const [interest, setInterest] = useState('');
  const [time, setTime] = useState('');
  const [emi, setEmi] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [emiDetails, setEmiDetails] = useState<EMIDetail[]>([]);

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
        balance: Math.max(0, balance) // Ensure balance doesn't go below 0 due to rounding
      });
    }
    
    return details;
  };

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / (12 * 100); // monthly interest rate
    const t = parseFloat(time) * 12; // time in months
    
    const monthlyEmi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
    setResult(`Monthly EMI: ₹${monthlyEmi.toFixed(2)}`);
    
    // Calculate and set EMI details
    const details = calculateEMIDetails(p, r, t, monthlyEmi);
    setEmiDetails(details);
  };

  const calculateTimeframe = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / (12 * 100); // monthly interest rate
    const e = parseFloat(emi);
    
    const t = Math.log(e / (e - p * r)) / Math.log(1 + r);
    const years = Math.floor(t / 12);
    const months = Math.round(t % 12);
    
    setResult(`Time required: ${years} years and ${months} months`);
    
    // Calculate and set EMI details
    const totalMonths = years * 12 + months;
    const details = calculateEMIDetails(p, r, totalMonths, e);
    setEmiDetails(details);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'emi') {
      calculateEMI();
    } else {
      calculateTimeframe();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          EMI Calculator
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Calculate your EMI or find out how long it will take to repay your loan.
        </p>
      </motion.div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-white rounded-lg shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                variants={slideIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => {
                      setMode('emi');
                      setEmiDetails([]);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
                      mode === 'emi'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Calculate EMI
                  </button>
                  <button
                    onClick={() => {
                      setMode('timeframe');
                      setEmiDetails([]);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
                      mode === 'timeframe'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Calculate Time Frame
                  </button>
                </div>

                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Principal Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Interest Rate (% per annum)
                    </label>
                    <input
                      type="number"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      step="0.01"
                    />
                  </div>

                  {mode === 'emi' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time Period (years)
                      </label>
                      <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                        step="0.1"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Monthly EMI (₹)
                      </label>
                      <input
                        type="number"
                        value={emi}
                        onChange={(e) => setEmi(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Calculate
                  </button>
                </motion.form>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="mt-6 p-4 bg-indigo-50 rounded-md"
                    >
                      <p className="text-center text-lg font-semibold text-indigo-700">
                        {result}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* EMI Details Table */}
            <AnimatePresence>
              {emiDetails.length > 0 && (
                <motion.div 
                  className="overflow-auto"
                  variants={tableAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4">EMI Breakdown</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMI
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {emiDetails.map((detail, index) => (
                          <motion.tr
                            key={detail.month}
                            variants={rowVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {detail.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(detail.emi)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(detail.principal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(detail.interest)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(detail.balance)}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
