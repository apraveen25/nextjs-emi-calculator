"use client";

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
  ScaleOptions,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface EMIDetail {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface EMIChartsProps {
  emiDetails: EMIDetail[];
  theme: 'light' | 'dark';
  currency: Currency;
}

export default function EMICharts({ emiDetails, theme, currency }: EMIChartsProps) {
  const months = emiDetails.map(detail => `Month ${detail.month}`);
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const formatCurrency = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  const commonOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: function(value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = typeof context.raw === 'number' ? context.raw : parseFloat(context.raw as string);
            return ` ${formatCurrency(value)}`;
          }
        }
      }
    },
  };

  // EMI Breakdown Line Chart
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Principal',
        data: emiDetails.map(detail => detail.principal),
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        tension: 0.4,
      },
      {
        label: 'Interest',
        data: emiDetails.map(detail => detail.interest),
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        tension: 0.4,
      },
    ],
  };

  // Outstanding Balance Bar Chart
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Outstanding Balance',
        data: emiDetails.map(detail => detail.balance),
        backgroundColor: theme === 'dark' ? '#4ADE80' : '#10B981',
      },
    ],
  };

  // Payment Distribution Pie Chart
  const totalPrincipal = emiDetails.reduce((sum, detail) => sum + detail.principal, 0);
  const totalInterest = emiDetails.reduce((sum, detail) => sum + detail.interest, 0);

  const pieChartData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [totalPrincipal, totalInterest],
        backgroundColor: ['#4F46E5', '#EF4444'],
        borderColor: theme === 'dark' ? '#1F2937' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const containerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      variants={containerAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* EMI Components Chart */}
      <motion.div
        className={`p-4 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          EMI Components Over Time
        </h3>
        <div className="h-[300px]">
          <Line data={lineChartData} options={commonOptions} />
        </div>
      </motion.div>

      {/* Outstanding Balance Chart */}
      <motion.div
        className={`p-4 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Outstanding Balance Trend
        </h3>
        <div className="h-[300px]">
          <Bar data={barChartData} options={commonOptions} />
        </div>
      </motion.div>

      {/* Payment Distribution Chart */}
      <motion.div
        className={`p-4 rounded-lg shadow-lg lg:col-span-2 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Total Payment Distribution
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-[300px]">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
