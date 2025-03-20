
import React, { useState } from 'react';
import { AssetCard } from './AssetCard';
import { useData } from '@/context/DataContext';
import { CardSkeleton } from '@/components/common/Loader';
import { Search } from 'lucide-react';

interface AssetListProps {
  type: 'STOCK' | 'CRYPTO' | 'ALL';
  limit?: number;
  showSearch?: boolean;
  className?: string;
}

export const AssetList: React.FC<AssetListProps> = ({
  type,
  limit,
  showSearch = false,
  className = '',
}) => {
  const { stocksData, cryptoData, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  let filteredAssets = [];
  
  if (type === 'STOCK' || type === 'ALL') {
    filteredAssets.push(...stocksData);
  }
  
  if (type === 'CRYPTO' || type === 'ALL') {
    filteredAssets.push(...cryptoData);
  }
  
  // Filter by search term if provided
  if (searchTerm) {
    filteredAssets = filteredAssets.filter(
      asset => 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply limit if provided
  if (limit && filteredAssets.length > limit) {
    filteredAssets = filteredAssets.slice(0, limit);
  }
  
  return (
    <div className={className}>
      {showSearch && (
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search by symbol or name..."
            className="w-full rounded-md pl-10 pr-4 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.symbol}
              symbol={asset.symbol}
              name={asset.name}
              price={asset.price}
              previousPrice={asset.previousPrice}
              change={asset.change}
              changePercent={asset.changePercent}
              type={asset.type}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No assets found</p>
        </div>
      )}
    </div>
  );
};
