
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Users, Trophy, MessageSquare, TrendingUp, User, Star } from 'lucide-react';

const Community = () => {
  // Sample top trader data
  const topTraders = [
    {
      id: 1,
      name: "Rajesh Mehta",
      avatar: "RM",
      profit: 28.4,
      followers: 1245,
      strategy: "Momentum Trading"
    },
    {
      id: 2,
      name: "Anjali Singh",
      avatar: "AS",
      profit: 24.7,
      followers: 986,
      strategy: "Value Investing"
    },
    {
      id: 3,
      name: "Vikram Patel",
      avatar: "VP",
      profit: 22.1,
      followers: 782,
      strategy: "Swing Trading"
    },
    {
      id: 4,
      name: "Priya Gupta",
      avatar: "PG",
      profit: 19.5,
      followers: 654,
      strategy: "Technical Analysis"
    },
    {
      id: 5,
      name: "Anand Kumar",
      avatar: "AK",
      profit: 17.8,
      followers: 521,
      strategy: "Dividend Growth"
    }
  ];

  // Sample discussion topics
  const discussions = [
    {
      id: 1,
      title: "Thoughts on the recent IT sector rally?",
      author: "market_watcher",
      replies: 24,
      views: 142,
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Best cryptocurrency investments for 2024",
      author: "crypto_enthusiast",
      replies: 37,
      views: 215,
      time: "4 hours ago"
    },
    {
      id: 3,
      title: "PSU banks - undervalued or value trap?",
      author: "value_hunter",
      replies: 18,
      views: 98,
      time: "8 hours ago"
    },
    {
      id: 4,
      title: "Technical analysis of Nifty for next week",
      author: "chart_master",
      replies: 12,
      views: 76,
      time: "1 day ago"
    },
    {
      id: 5,
      title: "Getting started with options trading in India",
      author: "options_trader",
      replies: 45,
      views: 320,
      time: "2 days ago"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Trading Community</h1>
          <p className="text-muted-foreground mb-6">
            Connect with traders, share insights, and learn from successful strategies
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Top Performers
                  </h2>
                  <button className="text-sm text-primary">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-sm text-muted-foreground">Trader</th>
                        <th className="text-center py-2 font-medium text-sm text-muted-foreground">30D Return</th>
                        <th className="text-center py-2 font-medium text-sm text-muted-foreground">Followers</th>
                        <th className="text-right py-2 font-medium text-sm text-muted-foreground">Strategy</th>
                        <th className="text-right py-2 font-medium text-sm text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTraders.map(trader => (
                        <tr key={trader.id} className="border-b border-border last:border-0">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium mr-2">
                                {trader.avatar}
                              </div>
                              <div>{trader.name}</div>
                            </div>
                          </td>
                          <td className="py-3 text-center text-success">+{trader.profit}%</td>
                          <td className="py-3 text-center">{trader.followers}</td>
                          <td className="py-3 text-right">{trader.strategy}</td>
                          <td className="py-3 text-right">
                            <button className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                              Follow
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Discussions
                  </h2>
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                    New Topic
                  </button>
                </div>
                
                <div className="space-y-4">
                  {discussions.map(topic => (
                    <div key={topic.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{topic.title}</h3>
                        <span className="text-xs text-muted-foreground">{topic.time}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <User className="w-3 h-3 mr-1" />
                          <span>{topic.author}</span>
                        </div>
                        <div className="flex space-x-4 text-xs text-muted-foreground">
                          <div>{topic.replies} replies</div>
                          <div>{topic.views} views</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-sm text-primary">
                    View More Discussions
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Community Stats
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Members</span>
                    <span className="font-medium">24,587</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Online Now</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Topics Created Today</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Trade Ideas Shared</span>
                    <span className="font-medium">12,456</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Strategies
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center mr-2">
                        <TrendingUp className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm">Momentum Trading</span>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+18.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <Star className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">Value Investing</span>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+12.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center mr-2">
                        <TrendingUp className="w-3 h-3 text-warning" />
                      </div>
                      <span className="text-sm">Swing Trading</span>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+10.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center mr-2">
                        <TrendingUp className="w-3 h-3 text-destructive" />
                      </div>
                      <span className="text-sm">Technical Analysis</span>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+8.3%</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-3">
                    <p className="text-sm font-medium">Crypto Trading Workshop</p>
                    <p className="text-xs text-muted-foreground">Mar 22, 2024 • 7:00 PM</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-3">
                    <p className="text-sm font-medium">Options Strategies Webinar</p>
                    <p className="text-xs text-muted-foreground">Mar 25, 2024 • 6:30 PM</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-3">
                    <p className="text-sm font-medium">Technical Analysis Meetup</p>
                    <p className="text-xs text-muted-foreground">Mar 28, 2024 • 7:30 PM</p>
                  </div>
                </div>
                
                <button className="w-full text-center text-sm text-primary mt-4">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
