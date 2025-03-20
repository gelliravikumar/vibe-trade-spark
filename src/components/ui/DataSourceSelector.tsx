
import React from 'react';
import { useData } from '@/context/DataContext';
import { ApiProvider, ConnectionMethod } from '@/data/api';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const DataSourceSelector = () => {
  const { 
    apiProvider, 
    connectionMethod, 
    useDummyData, 
    connectionStatus,
    setApiProvider, 
    setConnectionMethod, 
    setUseDummyData, 
    refreshData 
  } = useData();

  const handleApiProviderChange = (value: string) => {
    setApiProvider(value as ApiProvider);
  };

  const handleConnectionMethodChange = (value: string) => {
    setConnectionMethod(value as ConnectionMethod);
  };

  const handleUseDummyDataChange = (checked: boolean) => {
    setUseDummyData(checked);
  };

  return (
    <div className="p-3 rounded-md border border-border">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="use-dummy-data" className="flex items-center gap-2">
            Use Dummy Data
            <span className="text-xs text-muted-foreground">(for demo purposes)</span>
          </Label>
          <Switch
            id="use-dummy-data"
            checked={useDummyData}
            onCheckedChange={handleUseDummyDataChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-provider">API Provider</Label>
          <Select
            disabled={useDummyData}
            value={apiProvider}
            onValueChange={handleApiProviderChange}
          >
            <SelectTrigger id="api-provider" className="w-full">
              <SelectValue placeholder="Select API Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NSE">NSE India</SelectItem>
              <SelectItem value="BSE">BSE India</SelectItem>
              <SelectItem value="BINANCE">Binance</SelectItem>
              <SelectItem value="COINGECKO">CoinGecko</SelectItem>
              <SelectItem value="COINBASE">Coinbase</SelectItem>
              <SelectItem value="DUMMY">Dummy Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="connection-method">Connection Method</Label>
          <Select
            disabled={useDummyData}
            value={connectionMethod}
            onValueChange={handleConnectionMethodChange}
          >
            <SelectTrigger id="connection-method" className="w-full">
              <SelectValue placeholder="Select Connection Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="REST">REST API (Polling)</SelectItem>
              <SelectItem value="WEBSOCKET">WebSocket (Real-time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Connection Status:</span>
            <span className="text-sm font-medium capitalize">
              {connectionStatus.status} {connectionStatus.icon}
            </span>
          </div>
          
          <button 
            onClick={() => refreshData()}
            className="btn-secondary text-xs"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};
