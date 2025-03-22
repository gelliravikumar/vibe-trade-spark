
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AssetList } from '@/components/markets/AssetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { LineChart, CandlestickChart, TrendingUp, Search, SlidersHorizontal, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Markets = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <TrendingUp className="h-8 w-8 mr-3 text-primary" />
                  Markets
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Explore real-time prices and trends for stocks and cryptocurrencies. Track market movements and discover new investment opportunities.
                </p>
              </div>
              
              <div className="w-full md:w-72 flex flex-col gap-2">
                <DataSourceSelector />
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(viewMode === 'grid' ? 'bg-primary/10 text-primary' : '')}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(viewMode === 'list' ? 'bg-primary/10 text-primary' : '')}
                    onClick={() => setViewMode('list')}
                  >
                    List View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {showFilters && (
              <Card className="p-4 mb-4 bg-muted/30 border border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price Range</label>
                    <div className="flex space-x-2">
                      <input type="number" placeholder="Min" className="w-full text-sm rounded border-input bg-background px-3 py-1" />
                      <span className="text-muted-foreground self-center">to</span>
                      <input type="number" placeholder="Max" className="w-full text-sm rounded border-input bg-background px-3 py-1" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Market Cap</label>
                    <select className="w-full text-sm rounded border-input bg-background px-3 py-1">
                      <option>All</option>
                      <option>Large Cap</option>
                      <option>Mid Cap</option>
                      <option>Small Cap</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Performance</label>
                    <select className="w-full text-sm rounded border-input bg-background px-3 py-1">
                      <option>All</option>
                      <option>Gainers</option>
                      <option>Losers</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline" className="mr-2">Reset</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </Card>
            )}
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList className="p-1 bg-muted/30">
                <TabsTrigger value="all" className="flex items-center gap-1.5 data-[state=active]:bg-background">
                  <LineChart className="w-4 h-4" />
                  All Assets
                </TabsTrigger>
                <TabsTrigger value="stocks" className="flex items-center gap-1.5 data-[state=active]:bg-background">
                  <CandlestickChart className="w-4 h-4" />
                  Stocks
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-1.5 data-[state=active]:bg-background">
                  <LineChart className="w-4 h-4" />
                  Cryptocurrencies
                </TabsTrigger>
              </TabsList>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-background border border-input focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                />
              </div>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  Market Insights
                </h3>
                <Button variant="ghost" size="sm">Refresh</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: Today, 09:45 AM. Indian market is currently <span className="text-success font-medium">up 1.2%</span> with technology stocks leading the gains. Crypto market is showing <span className="text-destructive font-medium">mixed signals</span> with Bitcoin trading sideways.
              </p>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <AssetList type="ALL" showSearch={false} viewMode={viewMode} />
            </TabsContent>
            
            <TabsContent value="stocks" className="mt-0">
              <AssetList type="STOCK" showSearch={false} viewMode={viewMode} />
            </TabsContent>
            
            <TabsContent value="crypto" className="mt-0">
              <AssetList type="CRYPTO" showSearch={false} viewMode={viewMode} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Markets;
