
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TradingTerminal } from '@/components/trade/TradingTerminal';
import { useParams } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { PageLoader } from '@/components/common/Loader';

const Trade = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { isLoading, refreshData } = useData();
  
  useEffect(() => {
    // Refresh data when the trade page loads
    refreshData().catch(error => {
      toast.error("Failed to load market data. Please try again.");
      console.error("Error loading market data:", error);
    });
  }, [refreshData]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <PageLoader />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TradingTerminal />
      <Footer />
    </div>
  );
};

export default Trade;
