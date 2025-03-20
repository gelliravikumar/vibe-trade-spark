
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MiniChart } from '@/components/charts/MiniChart';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AssetCardProps {
  symbol: string;
  name: string;
  price: number;
  previousPrice?: number;
  change: number;
  changePercent: number;
  type: 'STOCK' | 'CRYPTO';
  chartData?: { price: number }[];
  className?: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  symbol,
  name,
  price,
  previousPrice,
  change,
  changePercent,
  type,
  chartData,
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  
  // Handle price changes for animation
  useEffect(() => {
    if (previousPrice && previousPrice !== price) {
      setPriceDirection(price > previousPrice ? 'up' : 'down');
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [price, previousPrice]);
  
  const isPositive = change >= 0;
  
  return (
    <Link
      to={`/trade/${symbol}`}
      className={`glass-card rounded-lg p-4 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium">{symbol}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className="pill bg-secondary text-secondary-foreground">
          {type}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p 
            className={`text-2xl font-semibold ${
              isAnimating ? (priceDirection === 'up' ? 'price-up' : 'price-down') : ''
            }`}
          >
            {type === 'CRYPTO' && '₹'}
            {price.toLocaleString('en-IN', {
              maximumFractionDigits: price < 1 ? 6 : 2,
              minimumFractionDigits: price < 1 ? 2 : 2,
            })}
          </p>
          
          <div className="flex items-center space-x-1 mt-1">
            {isPositive ? (
              <ArrowUp className="w-4 h-4 text-success" />
            ) : (
              <ArrowDown className="w-4 h-4 text-destructive" />
            )}
            <span className={isPositive ? 'text-success' : 'text-destructive'}>
              {isPositive ? '+' : ''}
              {change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="h-24">
          <MiniChart 
            data={chartData} 
            isPositive={isPositive} 
            height={80}
          />
        </div>
      </div>
    </Link>
  );
};
