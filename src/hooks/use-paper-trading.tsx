
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePortfolio, PortfolioPosition, TradeHistoryItem } from '@/hooks/use-portfolio';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

// Default paper trading initial balance
const DEFAULT_PAPER_BALANCE = 10000;

// Local storage keys
const PAPER_BALANCE_KEY = 'trading_app_paper_balance';
const PAPER_HISTORY_KEY = 'trading_app_paper_history';

interface PaperTradingContextType {
  paperBalance: number;
  portfolioValue: number;
  isPaperTrading: boolean;
  setIsPaperTrading: (value: boolean) => void;
  addFunds: (amount: number) => void;
  resetAccount: () => void;
  executeTrade: (
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    name: string,
    assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    category?: string
  ) => boolean;
  tradingHistory: TradeHistoryItem[];
}

const PaperTradingContext = createContext<PaperTradingContextType | undefined>(undefined);

export const PaperTradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { portfolio, addPosition, updatePosition, removePosition, tradeHistory } = usePortfolio();
  const { stocksData, cryptoData } = useData();
  
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    try {
      const storedBalance = localStorage.getItem(PAPER_BALANCE_KEY);
      return storedBalance ? parseFloat(storedBalance) : DEFAULT_PAPER_BALANCE;
    } catch (error) {
      console.error('Failed to parse paper balance from localStorage:', error);
      return DEFAULT_PAPER_BALANCE;
    }
  });
  
  const [tradingHistory, setTradingHistory] = useState<TradeHistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(PAPER_HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Failed to parse paper trading history from localStorage:', error);
      return [];
    }
  });
  
  const [isPaperTrading, setIsPaperTrading] = useState<boolean>(true);
  
  // Calculate portfolio value
  const calculatePortfolioValue = (): number => {
    let totalValue = 0;
    
    Object.values(portfolio).forEach((position) => {
      // Find current price for the asset
      const asset = 
        [...stocksData, ...cryptoData].find(a => a.symbol === position.symbol);
      
      if (asset) {
        totalValue += position.quantity * asset.price;
      } else {
        // If asset not found, use the last known average price
        totalValue += position.quantity * position.avgPrice;
      }
    });
    
    return totalValue;
  };
  
  const portfolioValue = calculatePortfolioValue();
  
  // Save paper balance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PAPER_BALANCE_KEY, paperBalance.toString());
    } catch (error) {
      console.error('Failed to save paper balance to localStorage:', error);
    }
  }, [paperBalance]);
  
  // Save trading history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PAPER_HISTORY_KEY, JSON.stringify(tradingHistory));
    } catch (error) {
      console.error('Failed to save paper trading history to localStorage:', error);
    }
  }, [tradingHistory]);
  
  // Add funds to paper trading account
  const addFunds = (amount: number) => {
    if (amount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }
    
    setPaperBalance(prev => prev + amount);
  };
  
  // Reset paper trading account
  const resetAccount = () => {
    setPaperBalance(DEFAULT_PAPER_BALANCE);
    setTradingHistory([]);
    
    // Clear all positions (ideally would be limited to paper trading positions)
    Object.keys(portfolio).forEach(symbol => {
      removePosition(symbol);
    });
    
    toast.success("Paper trading account reset to ₹10,000");
  };
  
  // Execute a trade (buy or sell)
  const executeTrade = (
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    name: string,
    assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    category?: string
  ): boolean => {
    const total = quantity * price;
    
    if (type === 'BUY') {
      // Check if sufficient balance
      if (total > paperBalance) {
        toast.error("Insufficient funds for this transaction");
        return false;
      }
      
      // Execute buy order
      addPosition(symbol, quantity, price, total, name, assetType, category);
      
      // Update paper balance
      setPaperBalance(prev => prev - total);
      
      // Add to trading history
      const tradeRecord: TradeHistoryItem = {
        id: Date.now().toString(),
        date: new Date(),
        symbol,
        name,
        type: 'BUY',
        quantity,
        price,
        total
      };
      
      setTradingHistory(prev => [tradeRecord, ...prev]);
      
      return true;
    } else if (type === 'SELL') {
      // Check if has the position
      const position = portfolio[symbol];
      if (!position || position.quantity < quantity) {
        toast.error("You don't have enough shares to sell");
        return false;
      }
      
      // Execute sell order
      if (position.quantity === quantity) {
        removePosition(symbol);
      } else {
        const newQuantity = position.quantity - quantity;
        const newTotalInvestment = position.totalInvestment * (newQuantity / position.quantity);
        
        updatePosition(
          symbol,
          newQuantity,
          newTotalInvestment / newQuantity,
          newTotalInvestment
        );
      }
      
      // Update paper balance
      setPaperBalance(prev => prev + total);
      
      // Add to trading history
      const tradeRecord: TradeHistoryItem = {
        id: Date.now().toString(),
        date: new Date(),
        symbol,
        name,
        type: 'SELL',
        quantity,
        price,
        total
      };
      
      setTradingHistory(prev => [tradeRecord, ...prev]);
      
      return true;
    }
    
    return false;
  };
  
  return (
    <PaperTradingContext.Provider
      value={{
        paperBalance,
        portfolioValue,
        isPaperTrading,
        setIsPaperTrading,
        addFunds,
        resetAccount,
        executeTrade,
        tradingHistory
      }}
    >
      {children}
    </PaperTradingContext.Provider>
  );
};

export const usePaperTrading = () => {
  const context = useContext(PaperTradingContext);
  if (context === undefined) {
    throw new Error('usePaperTrading must be used within a PaperTradingProvider');
  }
  return context;
};
