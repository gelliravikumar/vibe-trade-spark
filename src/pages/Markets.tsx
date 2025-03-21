
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AssetList } from '@/components/markets/AssetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { LineChart, CandlestickChart } from 'lucide-react';

const Markets = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Markets</h1>
              <p className="text-muted-foreground">
                Explore the latest prices and trends for stocks and cryptocurrencies
              </p>
            </div>
            
            <div className="w-full md:w-72">
              <DataSourceSelector />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-1.5">
                  <LineChart className="w-4 h-4" />
                  All Assets
                </TabsTrigger>
                <TabsTrigger value="stocks" className="flex items-center gap-1.5">
                  <CandlestickChart className="w-4 h-4" />
                  Stocks
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-1.5">
                  <LineChart className="w-4 h-4" />
                  Cryptocurrencies
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <AssetList type="ALL" showSearch={true} />
            </TabsContent>
            
            <TabsContent value="stocks" className="mt-0">
              <AssetList type="STOCK" showSearch={true} />
            </TabsContent>
            
            <TabsContent value="crypto" className="mt-0">
              <AssetList type="CRYPTO" showSearch={true} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Markets;
