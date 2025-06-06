
import React from 'react';
import { useData } from '@/context/DataContext';
import { AssetCard } from '@/components/markets/AssetCard';
import { Flame } from 'lucide-react';
import { CardSkeleton } from '@/components/common/Loader';

interface TrendingAssetsProps {
  limit?: number;
  compact?: boolean;
}

export const TrendingAssets: React.FC<TrendingAssetsProps> = ({ 
  limit = 3,
  compact = false 
}) => {
  const { stocksData, cryptoData, isLoading } = useData();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-warning" />
          <h2 className="text-xl font-semibold">Trending Assets</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  // Get top movers (highest absolute percent change)
  const allAssets = [...stocksData, ...cryptoData];
  const trendingAssets = allAssets
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, limit);
  
  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-warning" />
          <h2 className="text-xl font-semibold">Trending Assets</h2>
        </div>
      )}
      
      <div className={`grid grid-cols-1 ${compact ? 'gap-2' : 'md:grid-cols-3 gap-4'}`}>
        {trendingAssets.map((asset) => (
          <AssetCard
            key={asset.symbol}
            symbol={asset.symbol}
            name={asset.name}
            price={asset.price}
            previousPrice={asset.previousPrice}
            change={asset.change}
            changePercent={asset.changePercent}
            type={asset.type}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};
