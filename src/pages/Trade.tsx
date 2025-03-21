
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
    // Load stored settings from localStorage
    const loadStoredSettings = () => {
      try {
        const apiProvider = localStorage.getItem('tradingApp_apiProvider');
        const connectionMethod = localStorage.getItem('tradingApp_connectionMethod');
        const useDummyData = localStorage.getItem('tradingApp_useDummyData');
        
        // Check if we have valid settings
        if (apiProvider && connectionMethod && useDummyData !== null) {
          console.log('Loaded settings from localStorage');
        } else {
          console.log('No stored settings found, using defaults');
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    };
    
    loadStoredSettings();
    
    // Add script for TradingView widget if not already loaded
    if (!document.getElementById('tradingview-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
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
      <TradingTerminal symbol={symbol} />
      <Footer />
    </div>
  );
};

export default Trade;
