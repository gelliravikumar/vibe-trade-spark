
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Newspaper, 
  Search, 
  TrendingUp, 
  Filter, 
  ExternalLink, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Sample news data (in real app, this would come from an API)
const newsData = [
  {
    id: 1,
    title: "RBI Keeps Repo Rate Unchanged at 6.5%, Maintains Growth Forecast at 7%",
    summary: "The Reserve Bank of India (RBI) has maintained the repo rate at 6.5% for the fifth consecutive time, keeping its stance as 'withdrawal of accommodation'.",
    source: "The Economic Times",
    category: "Economy",
    date: "2023-10-06T08:30:00",
    url: "#",
    image: "https://via.placeholder.com/800x400/3498db/ffffff?text=RBI+News"
  },
  {
    id: 2,
    title: "Reliance Industries Announces New Energy Venture",
    summary: "Reliance Industries has unveiled a significant investment in renewable energy, committing $10 billion to build a comprehensive green energy manufacturing ecosystem.",
    source: "Business Standard",
    category: "Corporate",
    date: "2023-10-05T14:15:00",
    url: "#",
    image: "https://via.placeholder.com/800x400/27ae60/ffffff?text=Reliance+Energy"
  },
  {
    id: 3,
    title: "TCS Reports 5.2% Growth in Q2 Profit",
    summary: "Tata Consultancy Services (TCS) has reported a 5.2% year-on-year growth in net profit for the second quarter, slightly exceeding market expectations.",
    source: "Financial Express",
    category: "Earnings",
    date: "2023-10-05T09:45:00",
    url: "#",
    image: "https://via.placeholder.com/800x400/f39c12/ffffff?text=TCS+Earnings"
  },
  {
    id: 4,
    title: "Indian Stock Market Hits New Record High",
    summary: "The BSE Sensex crossed the 66,000 mark for the first time, driven by strong performances in banking, IT, and energy sectors amid positive global cues.",
    source: "LiveMint",
    category: "Markets",
    date: "2023-10-04T16:30:00",
    url: "#",
    image: "https://via.placeholder.com/800x400/e74c3c/ffffff?text=Market+High"
  },
  {
    id: 5,
    title: "Government Announces New PLI Scheme for Semiconductor Manufacturing",
    summary: "The Indian government has unveiled a Production-Linked Incentive (PLI) scheme worth ₹76,000 crore for semiconductor and display manufacturing to boost domestic production.",
    source: "India Today",
    category: "Policy",
    date: "2023-10-03T11:20:00",
    url: "#",
    image: "https://via.placeholder.com/800x400/9b59b6/ffffff?text=Semiconductor+Policy"
  },
  {
    id: 6,
    title: "Crypto Market Stabilizes After Recent Volatility",
    summary: "The cryptocurrency market has shown signs of stabilization after a period of high volatility, with Bitcoin holding above the $27,000 level for the past week.",
    source: "CoinDesk",
    category: "Crypto",
    date: "2023-10-02T13:45:00",
    url: "#",
    image: "https://via.placeholder.com/800x400/34495e/ffffff?text=Crypto+Market"
  }
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter news based on search query and category
  const filteredNews = newsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ['all', ...new Set(newsData.map(item => item.category.toLowerCase()))];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Newspaper className="h-8 w-8 mr-3 text-primary" />
                  Market News & Updates
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Stay informed with the latest news, market updates, and financial information to make educated investment decisions.
                </p>
              </div>
              
              <div className="w-full md:w-72 flex flex-col gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="market" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="market">Market News</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Latest</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
              </div>
              
              <TabsContent value="market">
                <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize whitespace-nowrap"
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>
                
                {/* Featured News */}
                {filteredNews.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="col-span-1 lg:col-span-2 overflow-hidden">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={filteredNews[0].image} 
                          alt={filteredNews[0].title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                          <Badge className="mb-2">{filteredNews[0].category}</Badge>
                          <h2 className="text-xl font-bold">{filteredNews[0].title}</h2>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground mb-4">{filteredNews[0].summary}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{filteredNews[0].source}</span>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(filteredNews[0].date)}
                            <Clock className="h-4 w-4 ml-2" />
                            {formatTime(filteredNews[0].date)}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">Share</Button>
                        <Button className="flex items-center gap-1">
                          Read Full Article <ExternalLink className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <div className="space-y-4">
                      {filteredNews.slice(1, 4).map((news) => (
                        <Card key={news.id} className="overflow-hidden flex flex-col h-[calc(33.3%-11px)]">
                          <div className="flex flex-col justify-between h-full">
                            <CardHeader className="pb-2">
                              <Badge className="w-fit mb-1">{news.category}</Badge>
                              <CardTitle className="text-base">{news.title}</CardTitle>
                            </CardHeader>
                            <CardFooter className="pt-2 flex justify-between text-xs text-muted-foreground">
                              <span>{news.source}</span>
                              <span>{formatDate(news.date)}</span>
                            </CardFooter>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* News List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.length > 4 ? (
                    filteredNews.slice(4).map((news) => (
                      <Card key={news.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={news.image} 
                            alt={news.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-center mb-2">
                            <Badge>{news.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(news.date)}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{news.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{news.summary}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <span className="text-sm text-muted-foreground">{news.source}</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            Read <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No News Found</h3>
                      <p className="text-muted-foreground mb-4">
                        No news articles match your current search criteria.
                      </p>
                      <Button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
                
                {filteredNews.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Button variant="outline">Load More News</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analysis">
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Market Analysis Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on bringing you expert market analysis and insights.
                  </p>
                  <Button variant="outline">Check Back Later</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="text-center py-12">
                  <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Video Content Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on adding video content with market analysis and expert interviews.
                  </p>
                  <Button variant="outline">Check Back Later</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
