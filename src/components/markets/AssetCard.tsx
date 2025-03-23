
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MiniChart } from '@/components/charts/MiniChart';

interface AssetCardProps {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  type: 'STOCK' | 'CRYPTO' | 'ETF' | 'FOREX';
  compact?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  symbol,
  name,
  price,
  previousPrice,
  change,
  changePercent,
  type,
  compact = false
}) => {
  const navigate = useNavigate();
  const isPositive = changePercent >= 0;
  
  const handleCardClick = () => {
    navigate(`/trade/${symbol}`);
  };

  if (compact) {
    return (
      <div 
        className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-medium">{symbol.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium">{symbol}</div>
            <div className="text-sm text-muted-foreground">{name}</div>
          </div>
        </div>
        <div className="text-right">
          <div>₹{price.toLocaleString()}</div>
          <div className={`flex items-center justify-end ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <Badge variant={type === 'CRYPTO' ? 'secondary' : 'outline'}>
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="h-24">
          <MiniChart symbol={symbol} change={changePercent} />
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex flex-col items-start">
        <div className="text-2xl font-bold mb-1">₹{price.toLocaleString()}</div>
        <div className="flex items-center">
          <div className={`flex items-center ${isPositive ? 'text-success' : 'text-destructive'} mr-2`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
          <div className="text-sm text-muted-foreground">
            {isPositive ? '+' : ''}₹{change.toFixed(2)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
