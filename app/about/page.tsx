"use client";

import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            About EMI Calculator
          </h1>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`p-6 rounded-2xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className={`text-2xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Technology Stack
            </h2>
            <ul className={`list-disc list-inside space-y-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Next.js 13+ for modern web development</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS for responsive design</li>
              <li>Chart.js for data visualization</li>
              <li>Framer Motion for smooth animations</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`p-6 rounded-2xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className={`text-2xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Privacy & Security
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Your privacy is our priority. All calculations are performed locally in your browser.
              We don't store any of your financial information, and no data is sent to external servers.
              Feel free to use our calculator with complete peace of mind.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`mt-12 p-6 rounded-2xl shadow-lg text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-2xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Open Source
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            This project is open source and available on GitHub. We welcome contributions from the community
            to make our calculator even better. Whether you're a developer, designer, or financial expert,
            your input is valuable to us.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
