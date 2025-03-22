
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Markets from './pages/Markets';
import News from './pages/News';
import Portfolio from './pages/Portfolio';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Trade from './pages/Trade';
import PaperTrading from './pages/PaperTrading';
import RealTrading from './pages/RealTrading';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import TaxDocuments from './pages/TaxDocuments';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from 'sonner';
import { DataProvider } from './context/DataContext';
import { PortfolioProvider } from './hooks/use-portfolio';
import { PaperTradingProvider } from './hooks/use-paper-trading';
import { TooltipProvider } from '@radix-ui/react-tooltip';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <PortfolioProvider>
            <PaperTradingProvider>
              <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <Router>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/trade" element={<Trade />} />
                    <Route path="/trade/:symbol" element={<Trade />} />
                    <Route path="/paper-trading" element={<PaperTrading />} />
                    <Route path="/real-trading" element={<RealTrading />} />
                    <Route path="/tax-documents" element={<TaxDocuments />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
                <Toaster />
              </ThemeProvider>
            </PaperTradingProvider>
          </PortfolioProvider>
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
