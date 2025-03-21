import React, { useState, useEffect } from 'react';
import { 
  Star, Search, Plus, Trash2, Edit2, Save, X, FolderPlus, Folder, 
  ChevronDown, ChevronRight, ArrowDown, ArrowUp, Pencil, Check,
  MoreHorizontal
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WatchlistItem {
  symbol: string;
  name: string;
  type: 'STOCK' | 'CRYPTO';
}

interface WatchlistGroup {
  id: string;
  name: string;
  isExpanded?: boolean;
  items: WatchlistItem[];
}

interface Watchlist {
  id: string;
  name: string;
  groups: WatchlistGroup[];
}

// Mock initial watchlists for demo
const initialWatchlists: Watchlist[] = [
  {
    id: '1',
    name: 'Default',
    groups: [
      {
        id: 'g1',
        name: 'Favorites',
        isExpanded: true,
        items: [
          { symbol: 'RELIANCE', name: 'Reliance Industries', type: 'STOCK' },
          { symbol: 'TATAMOTORS', name: 'Tata Motors', type: 'STOCK' },
        ]
      },
      {
        id: 'g2',
        name: 'Crypto',
        isExpanded: true,
        items: [
          { symbol: 'BTC', name: 'Bitcoin', type: 'CRYPTO' },
          { symbol: 'ETH', name: 'Ethereum', type: 'CRYPTO' },
        ]
      },
      {
        id: 'g3',
        name: 'Tech Stocks',
        isExpanded: false,
        items: [
          { symbol: 'INFY', name: 'Infosys', type: 'STOCK' },
          { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'STOCK' },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Secondary',
    groups: [
      {
        id: 'g4',
        name: 'Long Term',
        isExpanded: true,
        items: [
          { symbol: 'HDFCBANK', name: 'HDFC Bank', type: 'STOCK' },
        ]
      }
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
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  
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
  
  const toggleGroupExpansion = (groupId: string) => {
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.map(group => 
                group.id === groupId
                  ? { ...group, isExpanded: !group.isExpanded }
                  : group
              )
            }
          : list
      )
    );
  };
  
  const addToWatchlist = (asset: any, groupId?: string) => {
    const targetGroupId = groupId || selectedGroupId || currentWatchlist.groups[0].id;
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.map(group => 
                group.id === targetGroupId
                  ? {
                      ...group,
                      items: [
                        ...group.items.filter(item => item.symbol !== asset.symbol),
                        { 
                          symbol: asset.symbol, 
                          name: asset.name,
                          type: asset.type
                        }
                      ]
                    }
                  : group
              )
            }
          : list
      )
    );
    
    setSearchTerm('');
    setIsAddingItem(false);
    
    const groupName = currentWatchlist.groups.find(g => g.id === targetGroupId)?.name || '';
    toast.success(`Added ${asset.symbol} to ${groupName}`);
  };
  
  const removeFromWatchlist = (groupId: string, symbol: string) => {
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.map(group => 
                group.id === groupId
                  ? {
                      ...group,
                      items: group.items.filter(item => item.symbol !== symbol)
                    }
                  : group
              )
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
      groups: [
        {
          id: `g-${Date.now()}`,
          name: 'Default Group',
          isExpanded: true,
          items: []
        }
      ]
    };
    
    setWatchlists(prev => [...prev, newList]);
    setActiveWatchlist(newList.id);
    setNewListName('');
    toast.success(`Created new watchlist: ${newListName}`);
  };
  
  const createNewGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a valid group name");
      return;
    }
    
    const newGroup: WatchlistGroup = {
      id: `g-${Date.now()}`,
      name: newGroupName,
      isExpanded: true,
      items: []
    };
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: [...list.groups, newGroup]
            }
          : list
      )
    );
    
    setNewGroupName('');
    setIsAddingGroup(false);
    toast.success(`Added new group: ${newGroupName}`);
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
  
  const deleteGroup = (groupId: string) => {
    const watchlist = watchlists.find(list => list.id === activeWatchlist);
    if (watchlist && watchlist.groups.length <= 1) {
      toast.error("Cannot delete the only group in a watchlist");
      return;
    }
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.filter(group => group.id !== groupId)
            }
          : list
      )
    );
    
    toast.success("Group deleted");
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
  
  const renameGroup = (groupId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("Please enter a valid group name");
      return;
    }
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.map(group => 
                group.id === groupId
                  ? { ...group, name: newName }
                  : group
              )
            }
          : list
      )
    );
    
    toast.success("Group renamed");
  };
  
  const moveItemToGroup = (fromGroupId: string, toGroupId: string, item: WatchlistItem) => {
    if (fromGroupId === toGroupId) return;
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.map(group => 
                group.id === fromGroupId
                  ? {
                      ...group,
                      items: group.items.filter(i => i.symbol !== item.symbol)
                    }
                  : group
              )
            }
          : list
      )
    );
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? {
              ...list,
              groups: list.groups.map(group => 
                group.id === toGroupId
                  ? {
                      ...group,
                      items: [...group.items, item]
                    }
                  : group
              )
            }
          : list
      )
    );
    
    const toGroupName = currentWatchlist.groups.find(g => g.id === toGroupId)?.name || '';
    toast.success(`Moved ${item.symbol} to ${toGroupName}`);
  };
  
  const moveGroup = (groupId: string, direction: 'up' | 'down') => {
    const groupIndex = currentWatchlist.groups.findIndex(g => g.id === groupId);
    if (
      (direction === 'up' && groupIndex === 0) || 
      (direction === 'down' && groupIndex === currentWatchlist.groups.length - 1)
    ) {
      return;
    }
    
    const newGroups = [...currentWatchlist.groups];
    const targetIndex = direction === 'up' ? groupIndex - 1 : groupIndex + 1;
    
    [newGroups[groupIndex], newGroups[targetIndex]] = [newGroups[targetIndex], newGroups[groupIndex]];
    
    setWatchlists(prev => 
      prev.map(list => 
        list.id === activeWatchlist
          ? { ...list, groups: newGroups }
          : list
      )
    );
  };
  
  const totalItems = currentWatchlist.groups.reduce(
    (total, group) => total + group.items.length, 
    0
  );
  
  const GroupMenu = ({ group }: { group: WatchlistGroup }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 text-muted-foreground hover:text-foreground rounded-sm">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => {
          setNewGroupName(group.name);
          const name = prompt("Enter new group name:", group.name);
          if (name) renameGroup(group.id, name);
        }}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => moveGroup(group.id, 'up')}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Move Up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => moveGroup(group.id, 'down')}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Move Down
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => deleteGroup(group.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  const ItemMenu = ({ groupId, item }: { groupId: string, item: WatchlistItem }) => {
    const otherGroups = currentWatchlist.groups.filter(g => g.id !== groupId);
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-2 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => removeFromWatchlist(groupId, item.symbol)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
          
          {otherGroups.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs text-muted-foreground">Move to group</div>
              {otherGroups.map(group => (
                <DropdownMenuItem 
                  key={group.id}
                  onClick={() => moveItemToGroup(groupId, group.id, item)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {group.name}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  return (
    <div className="glass-card rounded-lg p-3 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold flex items-center">
          <Star className="w-5 h-5 mr-2 text-warning" />
          Watchlists
        </h2>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                <FolderPlus className="w-3 h-3 mr-1" />
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
            className="h-8 px-2 text-xs"
            onClick={() => setIsAddingItem(true)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Symbol
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {watchlists.map(list => (
          <button
            key={list.id}
            onClick={() => setActiveWatchlist(list.id)}
            className={cn(
              'px-2.5 py-1 text-xs rounded-full flex items-center',
              activeWatchlist === list.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <Folder className="w-3 h-3 mr-1" />
            {list.name}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-3">
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
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={() => setIsCompact(!isCompact)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Compact View</span>
          </Button>
          
          <button 
            onClick={() => deleteWatchlist(activeWatchlist)}
            className="text-destructive hover:text-destructive/80"
            disabled={watchlists.length <= 1}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isAddingItem && (
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for stocks and crypto..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button 
              className="absolute right-2.5 top-2"
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
                    className="p-2 hover:bg-accent cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{asset.symbol}</div>
                        <div className="text-xs text-muted-foreground">{asset.name}</div>
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                              <Plus className="h-3 w-3 mr-1" />
                              Add To
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {currentWatchlist.groups.map(group => (
                              <DropdownMenuItem 
                                key={group.id}
                                onClick={() => addToWatchlist(asset, group.id)}
                              >
                                <Folder className="mr-2 h-4 w-4" />
                                {group.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-muted-foreground">
          {totalItems} items in {currentWatchlist.groups.length} groups
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setIsAddingGroup(true)}
        >
          <FolderPlus className="h-3 w-3 mr-1" />
          New Group
        </Button>
      </div>
      
      {isAddingGroup && (
        <div className="mb-3 flex gap-2">
          <Input
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="h-8 text-xs"
            autoFocus
          />
          <Button size="sm" className="h-8" onClick={createNewGroup}>
            <Check className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8" 
            onClick={() => setIsAddingGroup(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-26rem)]">
        {currentWatchlist.groups.map(group => (
          <div 
            key={group.id}
            className="border border-border rounded-md overflow-hidden"
          >
            <div 
              className="flex justify-between items-center px-2.5 py-1.5 bg-secondary/50"
            >
              <button
                className="flex items-center text-sm font-medium"
                onClick={() => toggleGroupExpansion(group.id)}
              >
                {group.isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5" />
                )}
                {group.name}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({group.items.length})
                </span>
              </button>
              
              <GroupMenu group={group} />
            </div>
            
            {group.isExpanded && (
              <div className="divide-y divide-border">
                {group.items.length > 0 ? (
                  group.items.map(item => {
                    const assetData = allAssets.find(asset => asset.symbol === item.symbol);
                    const price = assetData?.price || 0;
                    const change = assetData?.change || 0;
                    const changePercent = assetData?.changePercent || 0;
                    const isPositive = change >= 0;
                    
                    return (
                      <div 
                        key={item.symbol}
                        className={cn(
                          "flex justify-between items-center p-2 hover:bg-accent/30",
                          isCompact ? "py-1" : "py-2"
                        )}
                      >
                        <div className="flex items-center min-w-0">
                          {!isCompact && (
                            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center mr-2 flex-shrink-0">
                              {item.symbol[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center">
                              <span className={cn(
                                "font-medium truncate",
                                isCompact ? "text-xs" : "text-sm"
                              )}>
                                {item.symbol}
                              </span>
                              {!isCompact && (
                                <span className="text-xs ml-1.5 px-1 py-0.5 rounded-sm bg-secondary/70">
                                  {item.type}
                                </span>
                              )}
                            </div>
                            {!isCompact && (
                              <div className="text-xs text-muted-foreground truncate">
                                {item.name}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-right">
                            <div className={cn(
                              "font-medium",
                              isCompact ? "text-xs" : "text-sm"
                            )}>
                              ₹{price.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                            </div>
                            <div className={cn(
                              `text-xs ${isPositive ? 'text-success' : 'text-destructive'}`,
                              isCompact ? "hidden" : "block"
                            )}>
                              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                            </div>
                          </div>
                          
                          <ItemMenu groupId={group.id} item={item} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-3 text-muted-foreground text-sm">
                    <p>No symbols in this group</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {currentWatchlist.groups.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No groups in this watchlist</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsAddingGroup(true)}
            >
              <FolderPlus className="w-4 h-4 mr-1" />
              Add Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
