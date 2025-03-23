
import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data?: { price: number }[];
  color?: string;
  height?: number;
  isPositive?: boolean;
  symbol?: string;
  type?: 'STOCK' | 'CRYPTO';
  width?: number;
  showChart?: boolean;
  showTooltip?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  changePercent?: number;
}

// Generate random price history if none provided
const generateRandomData = (points = 20, initialPrice = 100, volatility = 0.02, symbol?: string) => {
  let price = initialPrice;
  
  // If we have a symbol, use it to seed the random data consistently
  if (symbol) {
    // Use the symbol's ASCII values to create a seed
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Use the seed to adjust initial price and volatility
    price = initialPrice * (0.5 + (seed % 100) / 100);
    volatility = 0.01 + (seed % 10) / 100;
  }
  
  return Array.from({ length: points }, () => {
    price = price * (1 + (Math.random() - 0.5) * volatility);
    return { price };
  });
};

export const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  color = 'currentColor',
  height = 40,
  isPositive = true,
  symbol,
  type,
  width,
  showChart = true,
  showTooltip = false,
  positiveColor = 'var(--success)',
  negativeColor = 'var(--destructive)',
  changePercent
}) => {
  const [chartData, setChartData] = useState<{ price: number }[]>([]);
  // If changePercent is provided, use it to determine if the chart is positive or negative
  const effectiveIsPositive = changePercent !== undefined ? changePercent >= 0 : isPositive;
  const chartColor = effectiveIsPositive ? positiveColor : negativeColor;
  
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      // Generate more consistent random data for the same symbol
      setChartData(generateRandomData(20, 100, 0.02, symbol));
    }
  }, [data, symbol]);

  if (!showChart) {
    return null;
  }

  return (
    <div className="w-full h-full" style={{ height, width: width || '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={chartColor} 
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
