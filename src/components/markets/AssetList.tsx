import React, { useState } from 'react';
import { AssetCard } from './AssetCard';
import { useData } from '@/context/DataContext';
import { CardSkeleton } from '@/components/common/Loader';
import { Search, ChevronUp, ChevronDown, Filter, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AssetListProps {
  type: 'STOCK' | 'CRYPTO' | 'ALL';
  limit?: number;
  showSearch?: boolean;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export const AssetList: React.FC<AssetListProps> = ({
  type,
  limit,
  showSearch = false,
  className = '',
  viewMode = 'grid'
}) => {
  const { stocksData, cryptoData, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const toggleSort = (field: 'name' | 'price' | 'change') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
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
  
  const sortAssets = (assets: any[]) => {
    return [...assets].sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortDirection === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else if (sortBy === 'change') {
        return sortDirection === 'asc' 
          ? a.changePercent - b.changePercent 
          : b.changePercent - a.changePercent;
      }
      return 0;
    });
  };
  
  filteredStocks = sortAssets(filteredStocks);
  filteredCrypto = sortAssets(filteredCrypto);
  
  if (limit) {
    const halfLimit = Math.ceil(limit / 2);
    
    if (type === 'ALL') {
      filteredStocks = filteredStocks.slice(0, halfLimit);
      filteredCrypto = filteredCrypto.slice(0, limit - filteredStocks.length);
    } else if (type === 'STOCK') {
      filteredStocks = filteredStocks.slice(0, limit);
    } else if (type === 'CRYPTO') {
      filteredCrypto = filteredCrypto.slice(0, limit);
    }
  }
  
  const renderListHeader = () => {
    return (
      <div className="hidden md:grid md:grid-cols-12 gap-4 bg-muted/30 rounded-md p-3 mb-3 text-sm font-medium">
        <div className="col-span-5 flex items-center cursor-pointer" onClick={() => toggleSort('name')}>
          <span>Name</span>
          {sortBy === 'name' && (
            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </div>
        <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort('price')}>
          <span>Price</span>
          {sortBy === 'price' && (
            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </div>
        <div className="col-span-2 flex items-center cursor-pointer" onClick={() => toggleSort('change')}>
          <span>Change</span>
          {sortBy === 'change' && (
            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </div>
        <div className="col-span-2 text-center">Action</div>
      </div>
    );
  };
  
  const renderListItem = (asset: any) => {
    return (
      <div key={asset.symbol} className="grid grid-cols-2 md:grid-cols-12 gap-4 p-3 border-b border-border/50 hover:bg-muted/20 transition-colors">
        <div className="col-span-2 md:col-span-5 flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3">
            {asset.symbol.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{asset.name}</div>
            <div className="text-xs text-muted-foreground">
              {asset.symbol}
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                {asset.type}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-3 flex flex-col justify-center">
          <div className="font-medium">₹{asset.price.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Previous: ₹{asset.previousPrice.toLocaleString()}</div>
        </div>
        <div className={`col-span-2 md:col-span-2 flex items-center ${asset.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
          {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
        </div>
        <div className="col-span-2 md:col-span-2 flex items-center justify-end md:justify-center">
          <Link to={`/trade/${asset.symbol}`}>
            <Button size="sm" variant="outline" className="hover:bg-primary/10 hover:text-primary">
              Trade
            </Button>
          </Link>
        </div>
      </div>
    );
  };
  
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
            <div className={cn("mb-6", {"glass-panel rounded-lg p-4": type === 'ALL'})}>
              {type === 'ALL' && (
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary/70" />
                  Stocks
                </h3>
              )}
              
              {viewMode === 'list' && renderListHeader()}
              
              {viewMode === 'grid' ? (
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
                      className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    />
                  ))}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  {filteredStocks.map(asset => renderListItem(asset))}
                </div>
              )}
            </div>
          )}
          
          {filteredStocks.length > 0 && filteredCrypto.length > 0 && type === 'ALL' && (
            <Separator className="my-8" />
          )}
          
          {filteredCrypto.length > 0 && (type === 'ALL' || type === 'CRYPTO') && (
            <div className={cn("mb-6", {"glass-panel rounded-lg p-4": type === 'ALL'})}>
              {type === 'ALL' && (
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2 text-primary/70" />
                  Cryptocurrencies
                </h3>
              )}
              
              {viewMode === 'list' && renderListHeader()}
              
              {viewMode === 'grid' ? (
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
                      className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    />
                  ))}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  {filteredCrypto.map(asset => renderListItem(asset))}
                </div>
              )}
            </div>
          )}
          
          {filteredStocks.length === 0 && filteredCrypto.length === 0 && (
            <div className="text-center py-10 glass-panel rounded-lg">
              <Filter className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No assets found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
