
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CardSkeleton } from '@/components/common/Loader';

// Dummy portfolio data
const dummyPortfolio = {
  totalValue: 125680.45,
  dayChange: 3520.80,
  dayChangePercent: 2.88,
  allocations: [
    { name: 'Reliance', value: 28500, color: '#0ea5e9' },
    { name: 'TCS', value: 22340, color: '#6366f1' },
    { name: 'Bitcoin', value: 35000, color: '#f59e0b' },
    { name: 'Ethereum', value: 18500, color: '#10b981' },
    { name: 'HDFC Bank', value: 12340, color: '#8b5cf6' },
    { name: 'Others', value: 9000, color: '#64748b' },
  ]
};

export const PortfolioSummary: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  if (isLoading) {
    return <CardSkeleton className="h-[300px]" />;
  }
  
  const { totalValue, dayChange, dayChangePercent, allocations } = dummyPortfolio;
  const isPositive = dayChange >= 0;
  
  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-3xl font-semibold">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Today's Change</p>
            <p className={`text-lg font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}₹{dayChange.toLocaleString('en-IN')} ({isPositive ? '+' : ''}{dayChangePercent}%)
            </p>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">Allocation</p>
            <div className="space-y-2">
              {allocations.map((item) => (
                <div key={item.name} className="flex items-center">
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
                data={allocations}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
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
    </div>
  );
};
