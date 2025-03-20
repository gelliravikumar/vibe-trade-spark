
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TradingTerminal } from '@/components/trade/TradingTerminal';

const Trade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TradingTerminal />
      <Footer />
    </div>
  );
};

export default Trade;
