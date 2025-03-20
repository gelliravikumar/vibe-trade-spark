
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
  totalInvestment: number;
  name: string;
  type: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER';
  category?: string;
}

interface PortfolioState {
  [symbol: string]: PortfolioPosition;
}

interface TradeHistoryItem {
  id: string;
  date: Date;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
}

interface PortfolioContextType {
  portfolio: PortfolioState;
  tradeHistory: TradeHistoryItem[];
  addPosition: (
    symbol: string, 
    quantity: number, 
    price: number, 
    total: number,
    name: string,
    type: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    category?: string
  ) => void;
  updatePosition: (
    symbol: string, 
    quantity: number, 
    avgPrice: number, 
    totalInvestment: number
  ) => void;
  removePosition: (symbol: string) => void;
  clearPortfolio: () => void;
}

// Initialize with some sample portfolio data
const defaultPortfolio: PortfolioState = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    quantity: 10,
    avgPrice: 2850.75,
    totalInvestment: 28507.50,
    name: 'Reliance Industries',
    type: 'STOCK',
    category: 'Energy'
  },
  'TCS': {
    symbol: 'TCS',
    quantity: 5,
    avgPrice: 3575.20,
    totalInvestment: 17876.00,
    name: 'Tata Consultancy Services',
    type: 'STOCK',
    category: 'Technology'
  },
  'INFY': {
    symbol: 'INFY',
    quantity: 15,
    avgPrice: 1620.50,
    totalInvestment: 24307.50,
    name: 'Infosys',
    type: 'STOCK',
    category: 'Technology'
  },
  'BTC': {
    symbol: 'BTC',
    quantity: 0.15,
    avgPrice: 52000.00,
    totalInvestment: 7800.00,
    name: 'Bitcoin',
    type: 'CRYPTO',
    category: 'Cryptocurrency'
  },
  'HDFC': {
    symbol: 'HDFC',
    quantity: 12,
    avgPrice: 1580.25,
    totalInvestment: 18963.00,
    name: 'HDFC Bank',
    type: 'BANK',
    category: 'Banking'
  },
  'GOLD': {
    symbol: 'GOLD',
    quantity: 10,
    avgPrice: 5200.00,
    totalInvestment: 52000.00,
    name: 'Gold ETF',
    type: 'OTHER',
    category: 'Commodities'
  }
};

const sampleTradeHistory: TradeHistoryItem[] = [
  {
    id: '1',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    type: 'BUY',
    quantity: 10,
    price: 2850.75,
    total: 28507.50
  },
  {
    id: '2',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    type: 'BUY',
    quantity: 5,
    price: 3575.20,
    total: 17876.00
  },
  {
    id: '3',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'BUY',
    quantity: 0.15,
    price: 52000.00,
    total: 7800.00
  }
];

// Storage keys
const PORTFOLIO_STORAGE_KEY = 'trading_app_portfolio';
const TRADE_HISTORY_STORAGE_KEY = 'trading_app_trade_history';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioState>(() => {
    try {
      const storedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      return storedPortfolio ? JSON.parse(storedPortfolio) : defaultPortfolio;
    } catch (error) {
      console.error('Failed to parse portfolio from localStorage:', error);
      return defaultPortfolio;
    }
  });
  
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(TRADE_HISTORY_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : sampleTradeHistory;
    } catch (error) {
      console.error('Failed to parse trade history from localStorage:', error);
      return sampleTradeHistory;
    }
  });
  
  // Save to localStorage whenever portfolio or trade history changes
  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    } catch (error) {
      console.error('Failed to save portfolio to localStorage:', error);
    }
  }, [portfolio]);
  
  useEffect(() => {
    try {
      localStorage.setItem(TRADE_HISTORY_STORAGE_KEY, JSON.stringify(tradeHistory));
    } catch (error) {
      console.error('Failed to save trade history to localStorage:', error);
    }
  }, [tradeHistory]);
  
  const addPosition = (
    symbol: string, 
    quantity: number, 
    price: number, 
    total: number,
    name: string,
    type: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    category?: string
  ) => {
    setPortfolio(prev => {
      const newPortfolio = { ...prev };
      
      if (newPortfolio[symbol]) {
        // Update existing position
        const existingPosition = newPortfolio[symbol];
        const newQuantity = existingPosition.quantity + quantity;
        const newTotalInvestment = existingPosition.totalInvestment + total;
        
        newPortfolio[symbol] = {
          ...existingPosition,
          quantity: newQuantity,
          avgPrice: newTotalInvestment / newQuantity,
          totalInvestment: newTotalInvestment,
        };
      } else {
        // Create new position
        newPortfolio[symbol] = {
          symbol,
          quantity,
          avgPrice: price,
          totalInvestment: total,
          name,
          type,
          category,
        };
      }
      
      return newPortfolio;
    });
    
    // Add to trade history
    setTradeHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        date: new Date(),
        symbol,
        name,
        type: 'BUY',
        quantity,
        price,
        total,
      }
    ]);
  };
  
  const updatePosition = (
    symbol: string, 
    quantity: number, 
    avgPrice: number, 
    totalInvestment: number
  ) => {
    setPortfolio(prev => {
      const newPortfolio = { ...prev };
      
      if (newPortfolio[symbol]) {
        newPortfolio[symbol] = {
          ...newPortfolio[symbol],
          quantity,
          avgPrice,
          totalInvestment,
        };
      }
      
      return newPortfolio;
    });
  };
  
  const removePosition = (symbol: string) => {
    setPortfolio(prev => {
      const newPortfolio = { ...prev };
      delete newPortfolio[symbol];
      return newPortfolio;
    });
    
    toast.info(`Position in ${symbol} closed`);
  };
  
  const clearPortfolio = () => {
    setPortfolio({});
    toast.info('Portfolio cleared');
  };
  
  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        tradeHistory,
        addPosition,
        updatePosition,
        removePosition,
        clearPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
