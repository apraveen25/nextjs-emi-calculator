"use client";

import { ThemeProvider } from '../context/ThemeContext';
import Navigation from './Navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </ThemeProvider>
  );
}
