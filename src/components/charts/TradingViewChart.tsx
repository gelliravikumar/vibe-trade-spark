
import React, { useEffect, useRef, useState } from 'react';
import { useData } from '@/context/DataContext';
import { Maximize2, Minimize2, ChevronsRight, Settings, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Create a widget loader type
declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
  type?: 'STOCK' | 'CRYPTO';
  theme?: 'light' | 'dark';
  height?: number;
  width?: string;
  autosize?: boolean;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  type = 'STOCK',
  theme = 'dark',
  height = 500,
  width = '100%',
  autosize = true,
}) => {
  const { stocksData, cryptoData } = useData();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const widgetRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartStyle, setChartStyle] = useState<'1' | '2' | '3'>('2'); // 1: Bars, 2: Candles, 3: Line
  const [chartType, setChartType] = useState<'tradingview' | 'recharts'>('tradingview');
  
  // Determine the proper TradingView symbol
  const getTradingViewSymbol = () => {
    if (type === 'CRYPTO') {
      return `BINANCE:${symbol}USDT`;
    } else {
      // For stocks, we'll use NSE (National Stock Exchange of India) as default
      return `NSE:${symbol}`;
    }
  };
  
  useEffect(() => {
    // Check if TradingView script is already loaded
    if (!document.getElementById('tradingview-widget-script') && chartType === 'tradingview') {
      // Load the TradingView widget script
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
      scriptRef.current = script;
    } else if (window.TradingView && chartType === 'tradingview') {
      // If script is already loaded, just init the widget
      initWidget();
    }
    
    return () => {
      // Clean up widget when component unmounts
      if (widgetRef.current) {
        try {
          widgetRef.current = null;
        } catch (error) {
          console.error('Error cleaning up TradingView widget:', error);
        }
      }
      
      // Remove fullscreen event listeners
      if (isFullscreen) {
        document.removeEventListener('keydown', handleEscKey);
      }
    };
  }, [symbol, isFullscreen, chartStyle, chartType]); // Re-run when symbol, chartType or fullscreen state changes
  
  useEffect(() => {
    // Add ESC key handler when in fullscreen mode
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscKey);
      // When entering fullscreen, add a class to body to prevent scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscKey);
      // When exiting fullscreen, restore scrolling
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);
  
  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFullscreen(false);
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const changeChartStyle = (style: '1' | '2' | '3') => {
    setChartStyle(style);
    if (widgetRef.current && chartType === 'tradingview') {
      initWidget();
    }
  };
  
  const initWidget = () => {
    if (!containerRef.current || !window.TradingView || chartType !== 'tradingview') return;
    
    // Clear previous widget if exists
    if (containerRef.current.innerHTML) {
      containerRef.current.innerHTML = '';
    }
    
    const tvSymbol = getTradingViewSymbol();
    
    // Create new widget
    widgetRef.current = new window.TradingView.widget({
      container_id: containerRef.current.id,
      symbol: tvSymbol,
      interval: 'D', // Default to daily
      timezone: 'Asia/Kolkata',
      theme: theme,
      style: chartStyle,
      locale: 'en',
      toolbar_bg: theme === 'dark' ? '#2B2B43' : '#F1F3F6',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      save_image: true,
      height: isFullscreen ? '100%' : height,
      width: isFullscreen ? '100%' : width,
      autosize: isFullscreen ? true : autosize,
      studies: [
        'MACD@tv-basicstudies',
        'RSI@tv-basicstudies',
        'Volume@tv-basicstudies'
      ],
      time_frames: [
        { text: '1D', resolution: '1D' },
        { text: '1W', resolution: '1W' },
        { text: '1M', resolution: '1M' }
      ],
    });
  };

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-background flex flex-col' : 'relative'}>
      {/* Chart Header with Controls */}
      <div className={`flex items-center justify-between ${isFullscreen ? 'p-4 border-b' : 'mb-2'}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{symbol} Chart</h3>
          <Select value={chartType} onValueChange={(value: 'tradingview' | 'recharts') => setChartType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tradingview">TradingView</SelectItem>
              <SelectItem value="recharts">React Charts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          {chartType === 'tradingview' && (
            <div className="flex bg-secondary/80 backdrop-blur-sm rounded-md">
              <button 
                onClick={() => changeChartStyle('1')} 
                className={`px-2 py-1 text-xs ${chartStyle === '1' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                title="Bar Chart"
              >
                Bars
              </button>
              <button 
                onClick={() => changeChartStyle('2')} 
                className={`px-2 py-1 text-xs ${chartStyle === '2' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                title="Candlestick Chart"
              >
                Candles
              </button>
              <button 
                onClick={() => changeChartStyle('3')} 
                className={`px-2 py-1 text-xs ${chartStyle === '3' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                title="Line Chart"
              >
                Line
              </button>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-1"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className={`relative flex-grow overflow-hidden ${isFullscreen ? 'w-full h-full' : ''}`}>
        {chartType === 'tradingview' ? (
          <div 
            id={`tradingview_chart_${symbol.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
            ref={containerRef} 
            style={{ 
              height: isFullscreen ? 'calc(100vh - 57px)' : height, 
              width: isFullscreen ? '100%' : width 
            }}
            className="rounded-lg overflow-hidden"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center p-8 border rounded-lg bg-muted/10">
            <div className="text-center">
              <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">React Stock Charts</h3>
              <p className="text-muted-foreground mb-4">
                This chart library will be integrated soon. Please use TradingView for now.
              </p>
              <Button variant="secondary" onClick={() => setChartType('tradingview')}>
                Switch to TradingView
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
