
import React, { useState } from 'react';
import { AssetCard } from './AssetCard';
import { useData } from '@/context/DataContext';
import { CardSkeleton } from '@/components/common/Loader';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  
  // Prepare filtered assets based on type and search term
  let filteredStocks = [];
  let filteredCrypto = [];
  
  if (type === 'STOCK' || type === 'ALL') {
    filteredStocks = stocksData.filter(asset => 
      searchTerm ? (
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true
    );
  }
  
  if (type === 'CRYPTO' || type === 'ALL') {
    filteredCrypto = cryptoData.filter(asset => 
      searchTerm ? (
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true
    );
  }
  
  // Apply limit if provided
  if (limit) {
    const halfLimit = Math.ceil(limit / 2);
    
    if (type === 'ALL') {
      // Split limit between stocks and crypto
      filteredStocks = filteredStocks.slice(0, halfLimit);
      filteredCrypto = filteredCrypto.slice(0, limit - filteredStocks.length);
    } else if (type === 'STOCK') {
      filteredStocks = filteredStocks.slice(0, limit);
    } else if (type === 'CRYPTO') {
      filteredCrypto = filteredCrypto.slice(0, limit);
    }
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
      ) : (
        <div>
          {filteredStocks.length > 0 && (type === 'ALL' || type === 'STOCK') && (
            <div className="mb-6">
              {type === 'ALL' && (
                <h3 className="text-lg font-medium mb-3">Stocks</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks.map((asset) => (
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
            </div>
          )}
          
          {filteredStocks.length > 0 && filteredCrypto.length > 0 && type === 'ALL' && (
            <Separator className="my-4" />
          )}
          
          {filteredCrypto.length > 0 && (type === 'ALL' || type === 'CRYPTO') && (
            <div>
              {type === 'ALL' && (
                <h3 className="text-lg font-medium mb-3">Cryptocurrencies</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCrypto.map((asset) => (
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
            </div>
          )}
          
          {filteredStocks.length === 0 && filteredCrypto.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No assets found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
