
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiProvider, ConnectionMethod, DataType, fetchMarketData, createWebSocketConnection, closeWebSocketConnection, getConnectionStatus } from '../data/api';
import { stockData } from '../data/stocksData';
import { cryptoData } from '../data/cryptoData';
import { toast } from 'sonner';

interface DataContextType {
  isLoading: boolean;
  apiProvider: ApiProvider;
  connectionMethod: ConnectionMethod;
  useDummyData: boolean;
  stocksData: any[];
  cryptoData: any[];
  connectionStatus: { status: string; icon: string };
  setApiProvider: (provider: ApiProvider) => void;
  setConnectionMethod: (method: ConnectionMethod) => void;
  setUseDummyData: (use: boolean) => void;
  refreshData: () => Promise<void>;
}

const defaultContextValue: DataContextType = {
  isLoading: true,
  apiProvider: 'DUMMY',
  connectionMethod: 'WEBSOCKET',
  useDummyData: true,
  stocksData: [],
  cryptoData: [],
  connectionStatus: { status: 'disconnected', icon: '❌' },
  setApiProvider: () => {},
  setConnectionMethod: () => {},
  setUseDummyData: () => {},
  refreshData: async () => {},
};

const DataContext = createContext<DataContextType>(defaultContextValue);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiProvider, setApiProvider] = useState<ApiProvider>('DUMMY');
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>('WEBSOCKET');
  const [useDummyData, setUseDummyData] = useState(true);
  const [stocksData, setStocksData] = useState<any[]>(stockData);
  const [cryptos, setCryptoData] = useState<any[]>(cryptoData);
  const [connectionStatus, setConnectionStatus] = useState(getConnectionStatus());

  // Fetch initial data
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiProvider, useDummyData]);

  // Handle connection method changes
  useEffect(() => {
    if (connectionMethod === 'WEBSOCKET') {
      initializeWebSocket();
    } else {
      // Close any existing websocket when switching to REST
      closeWebSocketConnection();
      setConnectionStatus({ status: 'using REST', icon: '🔄' });
      
      // Set up polling interval for REST
      const intervalId = setInterval(() => {
        refreshData();
      }, 10000); // Poll every 10 seconds
      
      return () => clearInterval(intervalId);
    }
    
    return () => closeWebSocketConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionMethod, apiProvider, useDummyData]);

  const updateConnectionStatus = () => {
    setConnectionStatus(getConnectionStatus());
  };

  const initializeWebSocket = () => {
    // Get symbols from current data
    const stockSymbols = stocksData.map(stock => stock.symbol);
    const cryptoSymbols = cryptos.map(crypto => crypto.symbol);
    const allSymbols = [...stockSymbols, ...cryptoSymbols];
    
    // Create websocket connection
    createWebSocketConnection(
      useDummyData ? 'DUMMY' : apiProvider,
      allSymbols,
      handleWebSocketMessage,
      handleWebSocketError
    );
    
    // Update connection status periodically
    const statusInterval = setInterval(updateConnectionStatus, 2000);
    
    return () => {
      clearInterval(statusInterval);
      closeWebSocketConnection();
    };
  };

  const handleWebSocketMessage = (data: any) => {
    if (Array.isArray(data)) {
      // Handle dummy data format
      const stockUpdates = data.filter(item => item.type === 'STOCK');
      const cryptoUpdates = data.filter(item => item.type === 'CRYPTO');
      
      if (stockUpdates.length > 0) {
        setStocksData(stockUpdates);
      }
      
      if (cryptoUpdates.length > 0) {
        setCryptoData(cryptoUpdates);
      }
    } else {
      // Handle real websocket data formats based on provider
      try {
        if (apiProvider === 'BINANCE' && data.e === 'trade') {
          // Update specific crypto
          setCryptoData(prevData => 
            prevData.map(crypto => 
              crypto.symbol === data.s ? {
                ...crypto,
                previousPrice: crypto.price,
                price: parseFloat(data.p),
                change: parseFloat((parseFloat(data.p) - crypto.price).toFixed(2)),
                changePercent: parseFloat((((parseFloat(data.p) - crypto.price) / crypto.price) * 100).toFixed(2))
              } : crypto
            )
          );
        } else if (apiProvider === 'COINBASE' && data.type === 'ticker') {
          // Update specific crypto
          setCryptoData(prevData => 
            prevData.map(crypto => 
              crypto.symbol === data.product_id ? {
                ...crypto,
                previousPrice: crypto.price,
                price: parseFloat(data.price),
                change: parseFloat((parseFloat(data.price) - crypto.price).toFixed(2)),
                changePercent: parseFloat((((parseFloat(data.price) - crypto.price) / crypto.price) * 100).toFixed(2))
              } : crypto
            )
          );
        }
      } catch (error) {
        console.error('Error processing websocket message:', error);
      }
    }
  };

  const handleWebSocketError = (error: any) => {
    console.error('WebSocket error:', error);
    toast.error('WebSocket connection error. Switching to dummy data.');
    setUseDummyData(true);
  };

  const refreshData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch stocks data
      const stocks = await fetchMarketData(
        useDummyData ? 'DUMMY' : apiProvider,
        'STOCK'
      );
      setStocksData(stocks);
      
      // Fetch crypto data
      const cryptos = await fetchMarketData(
        useDummyData ? 'DUMMY' : apiProvider,
        'CRYPTO'
      );
      setCryptoData(cryptos);
      
      updateConnectionStatus();
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        isLoading,
        apiProvider,
        connectionMethod,
        useDummyData,
        stocksData,
        cryptoData: cryptos,
        connectionStatus,
        setApiProvider,
        setConnectionMethod,
        setUseDummyData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
