
import React, { useState, useEffect } from 'react';
import { DetailedChart } from '@/components/charts/DetailedChart';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { ArrowLeft, Info, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { AssetList } from '@/components/markets/AssetList';

export const TradingTerminal: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { stocksData, cryptoData } = useData();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('1');
  
  // Find the asset data
  const asset = symbol ? [...stocksData, ...cryptoData].find(asset => asset.symbol === symbol) : null;
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // If no symbol is provided, show a list of assets to choose from
  if (!symbol) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <h1 className="text-2xl font-bold mb-6">Select an Asset to Trade</h1>
        
        <div className="mb-6">
          <DataSourceSelector />
        </div>
        
        <AssetList type="ALL" showSearch={true} />
      </div>
    );
  }
  
  // If symbol is provided but asset not found
  if (!asset) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <button onClick={handleBack} className="flex items-center text-sm mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="glass-card rounded-lg p-8 text-center">
          <p className="text-lg">Symbol not found: {symbol}</p>
          <button 
            onClick={() => navigate('/markets')}
            className="btn-primary mt-4"
          >
            Browse Markets
          </button>
        </div>
      </div>
    );
  }
  
  const isPositive = asset.change >= 0;
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
      <button onClick={handleBack} className="flex items-center text-sm mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Asset header */}
          <div className="glass-card rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-semibold">{asset.name}</h1>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-secondary rounded-full">
                    {asset.symbol}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {asset.type === 'STOCK' ? asset.exchange : 'Cryptocurrency'}
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <div className="text-3xl font-semibold">
                  {asset.type === 'CRYPTO' && '₹'}
                  {asset.price.toLocaleString('en-IN', {
                    maximumFractionDigits: asset.price < 1 ? 6 : 2,
                  })}
                </div>
                <div className={`flex items-center ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span>
                    {isPositive ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="glass-card rounded-lg p-5">
            <DetailedChart symbol={asset.symbol} type={asset.type} />
          </div>
          
          {/* Stats */}
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Asset Information
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">
                  {asset.volume.toLocaleString('en-IN')}
                </p>
              </div>
              
              {asset.type === 'STOCK' ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">52W High</p>
                    <p className="font-medium">
                      {asset.high52Week.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">52W Low</p>
                    <p className="font-medium">
                      {asset.low52Week.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">P/E Ratio</p>
                    <p className="font-medium">
                      {asset.pe.toFixed(2)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">24h High</p>
                    <p className="font-medium">
                      {asset.high24h.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Low</p>
                    <p className="font-medium">
                      {asset.low24h.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="font-medium">
                      ₹{(asset.marketCap / 1000000000).toFixed(2)}B
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Data source selection */}
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Data Settings
            </h2>
            
            <DataSourceSelector />
          </div>
          
          {/* Trading panel */}
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Place Order</h2>
            
            <div className="space-y-4">
              <div className="flex rounded-md overflow-hidden">
                <button
                  className={`flex-1 py-2 text-center transition-colors ${
                    orderType === 'buy'
                      ? 'bg-success text-success-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  onClick={() => setOrderType('buy')}
                >
                  Buy
                </button>
                <button
                  className={`flex-1 py-2 text-center transition-colors ${
                    orderType === 'sell'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  onClick={() => setOrderType('sell')}
                >
                  Sell
                </button>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Est. Value</span>
                  <span className="font-medium">
                    ₹{(parseFloat(quantity) * asset.price).toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              
              <button
                className={orderType === 'buy' ? 'btn-primary w-full bg-success hover:bg-success/90' : 'btn-primary w-full bg-destructive hover:bg-destructive/90'}
              >
                {orderType === 'buy' ? 'Buy' : 'Sell'} {asset.symbol}
              </button>
              
              <p className="text-xs text-muted-foreground text-center mt-2">
                Demo mode: No real transactions are being made
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
