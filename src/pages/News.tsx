
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Newspaper, Zap, Bookmark, TrendingUp } from 'lucide-react';

const News = () => {
  // Sample news data
  const newsItems = [
    {
      id: 1,
      title: "RBI's Monetary Policy Impacts Indian Markets",
      summary: "The Reserve Bank of India kept interest rates unchanged in its latest policy meeting, influencing stock movements across sectors.",
      source: "Economic Times",
      time: "2 hours ago",
      category: "Policy",
      sentiment: "neutral"
    },
    {
      id: 2,
      title: "Tech Stocks Rally as IT Spending Projections Increase",
      summary: "Indian IT giants see stock price jumps as analysts predict increased tech spending in the next fiscal year.",
      source: "Business Standard",
      time: "4 hours ago",
      category: "Technology",
      sentiment: "positive"
    },
    {
      id: 3,
      title: "Cryptocurrency Regulations in India: New Guidelines Expected",
      summary: "Government sources hint at progressive regulations for cryptocurrency trading in the coming months.",
      source: "Mint",
      time: "6 hours ago",
      category: "Cryptocurrency",
      sentiment: "positive"
    },
    {
      id: 4,
      title: "Banking Sector Under Pressure Amid Global Concerns",
      summary: "Indian banking stocks face challenges as global banking concerns spill over into domestic markets.",
      source: "Financial Express",
      time: "12 hours ago",
      category: "Banking",
      sentiment: "negative"
    },
    {
      id: 5,
      title: "Consumer Goods Sector Shows Resilience in Quarterly Results",
      summary: "FMCG companies report better-than-expected quarterly results despite inflation pressures.",
      source: "Hindu BusinessLine",
      time: "1 day ago",
      category: "Consumer Goods",
      sentiment: "positive"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Market News & Insights</h1>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest market news, analysis, and events
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Newspaper className="w-5 h-5 mr-2" />
                    Latest News
                  </h2>
                  <button className="text-sm text-primary">View All</button>
                </div>
                
                <div className="space-y-6">
                  {newsItems.map(item => (
                    <div key={item.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="font-medium">{item.source}</span>
                            <span className="mx-2">•</span>
                            <span>{item.time}</span>
                            <span className="mx-2">•</span>
                            <span className="px-2 py-0.5 bg-secondary rounded-full">{item.category}</span>
                            <span 
                              className={`ml-2 px-2 py-0.5 rounded-full ${
                                item.sentiment === 'positive' ? 'bg-success/10 text-success' :
                                item.sentiment === 'negative' ? 'bg-destructive/10 text-destructive' :
                                'bg-secondary'
                              }`}
                            >
                              {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI-Powered Market Insights
                  </h2>
                </div>
                
                <div className="p-4 border border-border rounded-lg bg-card/50">
                  <p className="text-sm mb-2 font-medium">Market Prediction (Next 7 Days)</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full border-4 border-success flex items-center justify-center">
                      <span className="text-xl font-bold">65%</span>
                    </div>
                    <div>
                      <p className="font-medium">Bullish Sentiment</p>
                      <p className="text-sm text-muted-foreground">Based on news sentiment, technical indicators, and market patterns</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Key Insights</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 text-success mr-2 mt-0.5" />
                      <span>IT sector likely to outperform broader markets due to positive earnings sentiment</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 text-success mr-2 mt-0.5" />
                      <span>Technical indicators suggest support levels holding for Nifty at 22,100</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 text-destructive mr-2 mt-0.5 rotate-180" />
                      <span>Banking stocks face headwinds due to potential margin pressure in the near term</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Market Calendar</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-3">
                    <p className="text-sm font-medium">March 20, 2024</p>
                    <p className="text-xs">RBI Monetary Policy Meeting</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-3">
                    <p className="text-sm font-medium">March 22, 2024</p>
                    <p className="text-xs">Quarterly Results: TCS, Infosys</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-3">
                    <p className="text-sm font-medium">March 25, 2024</p>
                    <p className="text-xs">GDP Data Release</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-3">
                    <p className="text-sm font-medium">March 28, 2024</p>
                    <p className="text-xs">US Fed Interest Rate Decision</p>
                  </div>
                </div>
                
                <button className="w-full text-center text-sm text-primary mt-4">
                  View Full Calendar
                </button>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Top Trending Keywords</h2>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">RBI Policy</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">Inflation</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">IT Stocks</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">Cryptocurrency</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">Banking</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">Quarterly Results</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">Market Rally</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">Interest Rates</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">FII Activity</span>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">News Sources</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Economic Times</span>
                    <button className="text-primary text-xs">Follow</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Business Standard</span>
                    <button className="text-primary text-xs">Follow</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Livemint</span>
                    <button className="text-primary text-xs">Follow</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Financial Express</span>
                    <button className="text-primary text-xs">Follow</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>MoneyControl</span>
                    <button className="text-primary text-xs">Follow</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
