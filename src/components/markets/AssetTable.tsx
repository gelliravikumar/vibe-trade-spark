
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { MiniChart } from '@/components/charts/MiniChart';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface AssetTableProps {
  type: 'STOCK' | 'CRYPTO' | 'ALL';
  limit?: number;
  showSearch?: boolean;
  className?: string;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  type,
  limit,
  showSearch = false,
  className = '',
}) => {
  const { stocksData, cryptoData, isLoading } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({ key: 'symbol', direction: 'ascending' });
  
  // Mock watchlist data (this would come from a context or state in a real app)
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS', 'BTC']);
  
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
  
  // Sort the assets
  filteredAssets.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Apply limit if provided
  if (limit && filteredAssets.length > limit) {
    filteredAssets = filteredAssets.slice(0, limit);
  }
  
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  };
  
  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(prev => prev.filter(s => s !== symbol));
    } else {
      setWatchlist(prev => [...prev, symbol]);
    }
  };
  
  const handleRowClick = (symbol: string) => {
    navigate(`/trade/${symbol}`);
  };
  
  return (
    <div className={className}>
      {showSearch && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold"
                  onClick={() => handleSort('symbol')}
                >
                  Symbol
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold"
                  onClick={() => handleSort('price')}
                >
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold"
                  onClick={() => handleSort('change')}
                >
                  Change
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold"
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-20">Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => {
              const isPositive = asset.change >= 0;
              const isInWatchlist = watchlist.includes(asset.symbol);
              
              return (
                <TableRow 
                  key={asset.symbol}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleRowClick(asset.symbol)}
                >
                  <TableCell onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(asset.symbol);
                  }}>
                    {isInWatchlist ? (
                      <Star className="h-4 w-4 text-warning" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{asset.symbol}</TableCell>
                  <TableCell className="text-sm">{asset.name}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{asset.price.toLocaleString('en-IN', {
                      maximumFractionDigits: asset.price < 1 ? 6 : 2,
                    })}
                  </TableCell>
                  <TableCell className={isPositive ? 'text-success' : 'text-destructive'}>
                    {isPositive ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                  </TableCell>
                  <TableCell>
                    {asset.volume.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    {asset.marketCap ? `₹${(asset.marketCap / 10000000).toFixed(2)}Cr` : '-'}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-secondary">
                      {asset.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <MiniChart 
                      symbol={asset.symbol} 
                      type={asset.type}
                      height={30}
                      width={60}
                      showChart={true}
                      showTooltip={false}
                      positiveColor="var(--success)"
                      negativeColor="var(--destructive)"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
