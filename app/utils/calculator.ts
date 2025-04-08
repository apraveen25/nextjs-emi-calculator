import { EMIDetail } from '../types/calculator';

export const calculateEMIDetails = (
  p: number,
  r: number,
  t: number,
  monthlyEmi: number
): EMIDetail[] => {
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

export const calculateMonthlyEMI = (
  principal: number,
  annualInterestRate: number,
  years: number
): number => {
  const monthlyRate = annualInterestRate / (12 * 100); // monthly interest rate
  const months = years * 12; // time in months
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};

export const calculateLoanTerm = (
  principal: number,
  annualInterestRate: number,
  monthlyEMI: number
): number => {
  const monthlyRate = annualInterestRate / (12 * 100); // monthly interest rate
  return Math.log(monthlyEMI / (monthlyEMI - principal * monthlyRate)) / Math.log(1 + monthlyRate);
};
