
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-transparent border-primary ${sizeClasses[size]}`} />
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader size="lg" />
      <p className="mt-4 text-muted-foreground animate-pulse">Loading data...</p>
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-lg border border-border p-4 animate-pulse ${className}`}>
      <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
      <div className="h-10 bg-muted rounded w-full mb-3"></div>
      <div className="h-4 bg-muted rounded w-2/5 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/4"></div>
    </div>
  );
};
