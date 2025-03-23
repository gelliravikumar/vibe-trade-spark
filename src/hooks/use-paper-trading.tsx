
import React, { createContext, useContext, useState, useEffect } from 'react';

type TradeType = 'BUY' | 'SELL';
type AssetType = 'STOCK' | 'CRYPTO' | 'ETF' | 'FOREX';

interface Trade {
  id: string;
  symbol: string;
  name: string;
  type: TradeType;
  quantity: number;
  price: number;
  total: number;
  date: Date;
  assetType: AssetType;
}

interface PaperTradingContextType {
  paperBalance: number;
  portfolioValue: number;
  isPaperTrading: boolean;
  setIsPaperTrading: (value: boolean) => void;
  executeTrade: (trade: Trade) => boolean;
  resetPaperTrading: () => void;
  resetAccount: () => void;
  addFunds: (amount: number) => void;
  tradingHistory: Trade[];
}

const initialBalance = 1000000; // 10 Lakh rupees

const PaperTradingContext = createContext<PaperTradingContextType>({
  paperBalance: initialBalance,
  portfolioValue: 0,
  isPaperTrading: true,
  setIsPaperTrading: () => {},
  executeTrade: () => false,
  resetPaperTrading: () => {},
  resetAccount: () => {},
  addFunds: () => {},
  tradingHistory: [],
});

export const PaperTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('paperBalance');
    return savedBalance ? parseFloat(savedBalance) : initialBalance;
  });
  
  const [isPaperTrading, setIsPaperTrading] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('isPaperTrading');
    return savedMode ? savedMode === 'true' : true;
  });
  
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  
  const [tradingHistory, setTradingHistory] = useState<Trade[]>(() => {
    const savedHistory = localStorage.getItem('tradingHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('paperBalance', paperBalance.toString());
    localStorage.setItem('isPaperTrading', isPaperTrading.toString());
    localStorage.setItem('tradingHistory', JSON.stringify(tradingHistory));
  }, [paperBalance, isPaperTrading, tradingHistory]);
  
  // Function to execute a paper trade
  const executeTrade = (trade: Trade): boolean => {
    if (trade.type === 'BUY') {
      if (trade.total > paperBalance) {
        return false; // Not enough balance
      }
      
      setPaperBalance(prev => prev - trade.total);
      
      setTradingHistory(prev => [
        {
          ...trade,
          id: Date.now().toString(),
          date: new Date(),
        },
        ...prev
      ]);
      
      return true;
    } else if (trade.type === 'SELL') {
      // Check if user has the asset to sell
      const ownedAssets = tradingHistory.filter(
        t => t.symbol === trade.symbol && t.type === 'BUY'
      ).reduce((sum, t) => sum + t.quantity, 0);
      
      const soldAssets = tradingHistory.filter(
        t => t.symbol === trade.symbol && t.type === 'SELL'
      ).reduce((sum, t) => sum + t.quantity, 0);
      
      const availableToSell = ownedAssets - soldAssets;
      
      if (availableToSell < trade.quantity) {
        return false; // Not enough assets to sell
      }
      
      setPaperBalance(prev => prev + trade.total);
      
      setTradingHistory(prev => [
        {
          ...trade,
          id: Date.now().toString(),
          date: new Date(),
        },
        ...prev
      ]);
      
      return true;
    }
    
    return false;
  };
  
  // Reset paper trading account to initial state
  const resetPaperTrading = () => {
    setPaperBalance(initialBalance);
    setTradingHistory([]);
  };
  
  // Alias for resetPaperTrading for compatibility
  const resetAccount = () => {
    resetPaperTrading();
  };
  
  // Add funds to paper trading account
  const addFunds = (amount: number) => {
    setPaperBalance(prev => prev + amount);
  };
  
  // Calculate portfolio value based on trading history
  useEffect(() => {
    // This is a simplified calculation that doesn't account for current market prices
    // In a real app, you would fetch current prices and calculate the value
    const buys = tradingHistory.filter(t => t.type === 'BUY')
      .reduce((sum, t) => sum + t.total, 0);
      
    const sells = tradingHistory.filter(t => t.type === 'SELL')
      .reduce((sum, t) => sum + t.total, 0);
      
    setPortfolioValue(buys - sells);
  }, [tradingHistory]);
  
  return (
    <PaperTradingContext.Provider 
      value={{ 
        paperBalance, 
        portfolioValue,
        isPaperTrading, 
        setIsPaperTrading,
        executeTrade,
        resetPaperTrading,
        resetAccount,
        addFunds,
        tradingHistory
      }}
    >
      {children}
    </PaperTradingContext.Provider>
  );
};

export const usePaperTrading = () => useContext(PaperTradingContext);
