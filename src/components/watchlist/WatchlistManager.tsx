
import React, { useState, useEffect } from 'react';
import { 
  Star, Search, Plus, Trash2, Edit2, Save, X, FolderPlus, Folder 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

interface WatchlistItem {
  symbol: string;
  name: string;
  type: 'STOCK' | 'CRYPTO';
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

// Mock initial watchlists for demo
const initialWatchlists: Watchlist[] = [
  {
    id: '1',
    name: 'Favorites',
    items: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', type: 'STOCK' },
      { symbol: 'TATAMOTORS', name: 'Tata Motors', type: 'STOCK' },
      { symbol: 'BTC', name: 'Bitcoin', type: 'CRYPTO' },
    ]
  },
  {
    id: '2',
    name: 'Tech Stocks',
    items: [
      { symbol: 'INFY', name: 'Infosys', type: 'STOCK' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'STOCK' },
    ]
  }
];

export const WatchlistManager: React.FC = () => {
  const { stocksData, cryptoData } = useData();
  const [watchlists, setWatchlists] = useState<Watchlist[]>(initialWatchlists);
  const [activeWatchlist, setActiveWatchlist] = useState<string>(initialWatchlists[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  // Load watchlists from localStorage on component mount
  useEffect(() => {
    const savedWatchlists = localStorage.getItem('tradingApp_watchlists');
    if (savedWatchlists) {
      try {
        setWatchlists(JSON.parse(savedWatchlists));
      } catch (error) {
        console.error("Error parsing watchlists from localStorage:", error);
      }
    }
  }, []);
  
  // Save watchlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tradingApp_watchlists', JSON.stringify(watchlists));
  }, [watchlists]);
  
  const allAssets = [...stocksData, ...cryptoData];
  
  const filteredAssets = searchTerm 
    ? allAssets.filter(asset => 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
    
  const currentWatchlist = watchlists.find(list => list.id === activeWatchlist) || watchlists[0];
  
  const addToWatchlist = (asset: any) => {
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              items: [
                ...list.items.filter(item => item.symbol !== asset.symbol),
                { 
                  symbol: asset.symbol, 
                  name: asset.name,
                  type: asset.type
                }
              ]
            }
          : list
      )
    );
    setSearchTerm('');
    setIsAddingItem(false);
    toast.success(`Added ${asset.symbol} to ${currentWatchlist.name}`);
  };
  
  const removeFromWatchlist = (symbol: string) => {
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              items: list.items.filter(item => item.symbol !== symbol)
            }
          : list
      )
    );
    toast.success(`Removed from watchlist`);
  };
  
  const createNewWatchlist = () => {
    if (!newListName.trim()) {
      toast.error("Please enter a valid watchlist name");
      return;
    }
    
    const newList: Watchlist = {
      id: Date.now().toString(),
      name: newListName,
      items: []
    };
    
    setWatchlists(prev => [...prev, newList]);
    setActiveWatchlist(newList.id);
    setNewListName('');
    toast.success(`Created new watchlist: ${newListName}`);
  };
  
  const deleteWatchlist = (id: string) => {
    if (watchlists.length <= 1) {
      toast.error("Cannot delete the only watchlist");
      return;
    }
    
    setWatchlists(prev => prev.filter(list => list.id !== id));
    
    if (activeWatchlist === id) {
      setActiveWatchlist(watchlists.filter(list => list.id !== id)[0].id);
    }
    
    toast.success("Watchlist deleted");
  };
  
  const renameWatchlist = () => {
    if (!newListName.trim()) {
      toast.error("Please enter a valid watchlist name");
      return;
    }
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? { ...list, name: newListName }
          : list
      )
    );
    
    setIsEditingList(false);
    setNewListName('');
    toast.success("Watchlist renamed");
  };
  
  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Star className="w-5 h-5 mr-2 text-warning" />
          Watchlists
        </h2>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-1" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Watchlist Name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button onClick={createNewWatchlist}>Create Watchlist</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingItem(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Symbol
          </Button>
        </div>
      </div>
      
      {/* Watchlist tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {watchlists.map(list => (
          <button
            key={list.id}
            onClick={() => setActiveWatchlist(list.id)}
            className={`px-3 py-1 text-xs rounded-full flex items-center ${
              activeWatchlist === list.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Folder className="w-3 h-3 mr-1" />
            {list.name}
          </button>
        ))}
      </div>
      
      {/* Active watchlist header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="font-medium text-sm">
            {currentWatchlist.name}
          </h3>
          {!isEditingList ? (
            <button 
              onClick={() => {
                setIsEditingList(true);
                setNewListName(currentWatchlist.name);
              }}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          ) : (
            <div className="ml-2 flex items-center">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="h-6 text-xs w-32"
              />
              <button 
                onClick={renameWatchlist}
                className="ml-1 text-success"
              >
                <Save className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setIsEditingList(false)}
                className="ml-1 text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => deleteWatchlist(activeWatchlist)}
          className="text-destructive hover:text-destructive/80"
          disabled={watchlists.length <= 1}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Search interface when adding items */}
      {isAddingItem && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for stocks and crypto..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button 
              className="absolute right-3 top-2.5"
              onClick={() => setIsAddingItem(false)}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          
          {searchTerm && (
            <div className="mt-2 bg-background border border-border rounded-md max-h-60 overflow-y-auto">
              {filteredAssets.length > 0 ? (
                filteredAssets.slice(0, 10).map(asset => (
                  <div 
                    key={asset.symbol}
                    className="p-2 hover:bg-accent cursor-pointer flex justify-between items-center"
                    onClick={() => addToWatchlist(asset)}
                  >
                    <div>
                      <div className="font-medium text-sm">{asset.symbol}</div>
                      <div className="text-xs text-muted-foreground">{asset.name}</div>
                    </div>
                    <button className="text-primary">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Watchlist items */}
      {currentWatchlist.items.length > 0 ? (
        <div className="space-y-2">
          {currentWatchlist.items.map(item => {
            const assetData = allAssets.find(asset => asset.symbol === item.symbol);
            const price = assetData?.price || 0;
            const change = assetData?.change || 0;
            const changePercent = assetData?.changePercent || 0;
            const isPositive = change >= 0;
            
            return (
              <div 
                key={item.symbol}
                className="flex justify-between items-center p-2 rounded-md hover:bg-accent/50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2">
                    {item.symbol[0]}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{item.symbol}</span>
                      <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-secondary">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.name}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    ₹{price.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                  </div>
                  <div className={`text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                  </div>
                </div>
                
                <button
                  onClick={() => removeFromWatchlist(item.symbol)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p>No symbols in this watchlist</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setIsAddingItem(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Symbol
          </Button>
        </div>
      )}
    </div>
  );
};
