# EMI Calculator

A modern, responsive EMI (Equated Monthly Installment) calculator built with Next.js, TypeScript, and Tailwind CSS. Calculate your loan EMI or loan tenure with support for multiple currencies.

## Features

### Core Functionality
- Calculate EMI based on Principal, Interest Rate, and Time Period
- Calculate Time Period based on Principal, Interest Rate, and desired EMI
- Real-time EMI breakdown with Principal and Interest components
- Visual representation of EMI data using interactive charts

### Multi-Currency Support
- Support for 10 major currencies:
  - Indian Rupee (₹)
  - US Dollar ($)
  - Euro (€)
  - British Pound (£)
  - Japanese Yen (¥)
  - Australian Dollar (A$)
  - Canadian Dollar (C$)
  - Singapore Dollar (S$)
  - Chinese Yuan (¥)
  - UAE Dirham (د.إ)
- Automatic currency formatting based on locale
- Currency-aware calculations and displays

### Modern UI/UX
- Clean, professional interface with intuitive controls
- Responsive design that works on all devices
- Dark/Light theme support with smooth transitions
- Interactive animations and transitions
- Accessible form controls with proper labeling

### Data Export
- Export EMI schedule to Excel
- Detailed monthly breakdown including:
  - EMI amount
  - Principal component
  - Interest component
  - Outstanding balance
- Summary statistics in exported file
- Filename includes currency and date for easy reference

## Tech Stack
- Next.js 13+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- XLSX for Excel export functionality

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/emi-calculator.git
```

2. Install dependencies:
```bash
cd emi-calculator
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select your preferred currency from the dropdown menu
2. Choose calculation mode:
   - Calculate EMI: Input principal, interest rate, and loan term
   - Calculate Time: Input principal, interest rate, and desired EMI
3. Fill in the required values
4. Click "Calculate" to see results
5. View the EMI breakdown chart and table
6. Export to Excel if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
