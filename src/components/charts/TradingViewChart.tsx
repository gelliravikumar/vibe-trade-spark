
import React, { useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';

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
    };
  }, [symbol]); // Re-run when symbol changes
  
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
      style: '1',
      locale: 'en',
      toolbar_bg: theme === 'dark' ? '#2B2B43' : '#F1F3F6',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      save_image: true,
      height: height,
      width: width,
      autosize: autosize,
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
    <div 
      id={`tradingview_chart_${symbol.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
      ref={containerRef} 
      style={{ height: height, width: width }}
      className="rounded-lg overflow-hidden"
    />
  );
};
