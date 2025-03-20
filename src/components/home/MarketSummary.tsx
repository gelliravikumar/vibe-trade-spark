
import React from 'react';
import { useData } from '@/context/DataContext';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { CardSkeleton } from '@/components/common/Loader';

export const MarketSummary: React.FC = () => {
  const { stocksData, cryptoData, isLoading } = useData();
  
  if (isLoading) {
    return <CardSkeleton className="h-[180px]" />;
  }
  
  // Calculate market stats
  const stocksUp = stocksData.filter(stock => stock.change > 0).length;
  const stocksDown = stocksData.filter(stock => stock.change < 0).length;
  const cryptosUp = cryptoData.filter(crypto => crypto.change > 0).length;
  const cryptosDown = cryptoData.filter(crypto => crypto.change < 0).length;
  
  // Calculate average changes
  const avgStockChange = stocksData.reduce((sum, stock) => sum + stock.changePercent, 0) / stocksData.length;
  const avgCryptoChange = cryptoData.reduce((sum, crypto) => sum + crypto.changePercent, 0) / cryptoData.length;
  
  return (
    <div className="glass-card rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Market Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Indian Stocks</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowUp className="w-4 h-4 text-success" />
              <span>Advancing</span>
            </div>
            <span className="text-success font-medium">{stocksUp}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowDown className="w-4 h-4 text-destructive" />
              <span>Declining</span>
            </div>
            <span className="text-destructive font-medium">{stocksDown}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Average Change</span>
            <span className={`font-medium ${avgStockChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {avgStockChange >= 0 ? '+' : ''}{avgStockChange.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Cryptocurrencies</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowUp className="w-4 h-4 text-success" />
              <span>Rising</span>
            </div>
            <span className="text-success font-medium">{cryptosUp}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowDown className="w-4 h-4 text-destructive" />
              <span>Falling</span>
            </div>
            <span className="text-destructive font-medium">{cryptosDown}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Average Change</span>
            <span className={`font-medium ${avgCryptoChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {avgCryptoChange >= 0 ? '+' : ''}{avgCryptoChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
