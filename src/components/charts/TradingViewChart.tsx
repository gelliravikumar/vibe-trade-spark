
import React, { useEffect, useRef, useState } from 'react';
import { useData } from '@/context/DataContext';
import { Maximize2, Minimize2, ChevronsRight, Settings } from 'lucide-react';

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
  const [chartStyle, setChartStyle] = useState<'1' | '2' | '3'>('1'); // 1: Bars, 2: Candles, 3: Line
  
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
    if (!document.getElementById('tradingview-widget-script')) {
      // Load the TradingView widget script
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
      scriptRef.current = script;
    } else if (window.TradingView) {
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
  }, [symbol, isFullscreen, chartStyle]); // Re-run when symbol or fullscreen state changes
  
  useEffect(() => {
    // Add ESC key handler when in fullscreen mode
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
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
    if (widgetRef.current) {
      initWidget();
    }
  };
  
  const initWidget = () => {
    if (!containerRef.current || !window.TradingView) return;
    
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
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Chart controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <div className="flex bg-secondary/80 backdrop-blur-sm rounded-md">
          <button 
            onClick={() => changeChartStyle('1')} 
            className={`px-2 py-1 text-xs ${chartStyle === '1' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
          >
            Bars
          </button>
          <button 
            onClick={() => changeChartStyle('2')} 
            className={`px-2 py-1 text-xs ${chartStyle === '2' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
          >
            Candles
          </button>
          <button 
            onClick={() => changeChartStyle('3')} 
            className={`px-2 py-1 text-xs ${chartStyle === '3' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
          >
            Line
          </button>
        </div>
        
        <button
          onClick={toggleFullscreen}
          className="p-1.5 bg-secondary/80 backdrop-blur-sm rounded-md hover:bg-secondary"
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <div 
        id={`tradingview_chart_${symbol.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
        ref={containerRef} 
        style={{ height: isFullscreen ? '100vh' : height, width: isFullscreen ? '100vw' : width }}
        className={`rounded-lg overflow-hidden ${isFullscreen ? 'p-4' : ''}`}
      />
    </div>
  );
};
