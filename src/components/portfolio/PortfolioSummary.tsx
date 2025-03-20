
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CardSkeleton } from '@/components/common/Loader';
import { PortfolioPosition } from '@/hooks/use-portfolio';

interface PortfolioSummaryProps {
  isLoading?: boolean;
  portfolio?: Record<string, PortfolioPosition>;
  getCurrentPrice?: (symbol: string) => number;
  totalValue?: number;
  profitLoss?: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  isLoading = false,
  portfolio = {},
  getCurrentPrice = () => 0,
  totalValue = 0,
  profitLoss = 0
}) => {
  // Calculate portfolio allocations
  const allocations = useMemo(() => {
    if (!portfolio || Object.keys(portfolio).length === 0) {
      return [];
    }
    
    const allocationData = Object.values(portfolio).map(position => {
      const currentPrice = getCurrentPrice(position.symbol);
      const value = position.quantity * currentPrice;
      
      return {
        name: position.name,
        symbol: position.symbol,
        value,
        type: position.type,
        color: getColorForAssetType(position.type, position.symbol),
      };
    });
    
    // Sort by value in descending order
    return allocationData.sort((a, b) => b.value - a.value);
  }, [portfolio, getCurrentPrice]);
  
  // Get a color based on asset type
  function getColorForAssetType(type: string, symbol: string) {
    // Generate a consistent color based on the asset type and symbol
    const typeColors: Record<string, string[]> = {
      'STOCK': ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#8b5cf6', '#a855f7'],
      'CRYPTO': ['#f59e0b', '#f97316', '#d97706', '#fbbf24', '#facc15', '#fb923c'],
      'BANK': ['#10b981', '#34d399', '#059669', '#22c55e', '#4ade80'],
      'OTHER': ['#64748b', '#94a3b8', '#475569', '#1e293b', '#334155']
    };
    
    // Use the symbol to pick a consistent color from the array
    const colorArray = typeColors[type] || typeColors['OTHER'];
    const index = symbol.charCodeAt(0) % colorArray.length;
    return colorArray[index];
  }
  
  // Calculate some metrics for display
  const dayChange = profitLoss * 0.05; // Simulate a daily change
  const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;
  const isPositiveDay = dayChange >= 0;
  
  // Top allocations for display in the sidebar
  const topAllocations = allocations.slice(0, 5);
  const otherAllocations = allocations.slice(5);
  const otherValue = otherAllocations.reduce((sum, item) => sum + item.value, 0);
  
  // Add "Others" category if needed
  const displayAllocations = [...topAllocations];
  if (otherValue > 0) {
    displayAllocations.push({
      name: 'Others',
      symbol: 'OTHERS',
      value: otherValue,
      type: 'OTHER',
      color: '#64748b'
    });
  }
  
  if (isLoading) {
    return <CardSkeleton className="h-[300px]" />;
  }
  
  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
      
      {Object.keys(portfolio).length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>Your portfolio is empty. Start trading to see your portfolio summary.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-3xl font-semibold">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Today's Change</p>
              <p className={`text-lg font-medium ${isPositiveDay ? 'text-success' : 'text-destructive'}`}>
                {isPositiveDay ? '+' : ''}₹{dayChange.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isPositiveDay ? '+' : ''}{dayChangePercent.toFixed(2)}%)
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Allocation</p>
              <div className="space-y-2">
                {displayAllocations.map((item) => (
                  <div key={item.symbol} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm flex-1">{item.name}</span>
                    <span className="text-sm font-medium">
                      {((item.value / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayAllocations}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {displayAllocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--card-foreground)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
