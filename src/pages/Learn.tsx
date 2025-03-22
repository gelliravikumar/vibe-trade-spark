
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  BarChart3, 
  TrendingUp, 
  LineChart,
  ChevronRight,
  PlayCircle,
  Clock,
  Calendar,
  BookText,
  FileText,
  CheckCircle2,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample learning paths
const learningPaths = [
  {
    id: 1,
    title: "Trading Fundamentals",
    description: "Learn the basics of trading, market concepts, and essential terminology.",
    modules: 8,
    completedModules: 3,
    duration: "6 hours",
    level: "Beginner",
    image: "https://via.placeholder.com/400x200/3498db/ffffff?text=Trading+Fundamentals"
  },
  {
    id: 2,
    title: "Technical Analysis Mastery",
    description: "Master chart patterns, indicators, and technical trading strategies.",
    modules: 12,
    completedModules: 0,
    duration: "10 hours",
    level: "Intermediate",
    image: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Technical+Analysis"
  },
  {
    id: 3,
    title: "Fundamental Analysis",
    description: "Learn how to analyze financial statements and company valuations.",
    modules: 10,
    completedModules: 0,
    duration: "8 hours",
    level: "Intermediate",
    image: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Fundamental+Analysis"
  },
  {
    id: 4,
    title: "Options Trading",
    description: "Understand options contracts, strategies, and risk management.",
    modules: 14,
    completedModules: 0,
    duration: "12 hours",
    level: "Advanced",
    image: "https://via.placeholder.com/400x200/9b59b6/ffffff?text=Options+Trading"
  }
];

// Sample articles
const articles = [
  {
    id: 1,
    title: "Understanding Stock Market Indices",
    description: "Learn about major Indian indices like Sensex and Nifty, how they're calculated, and what they represent.",
    author: "Market Expert",
    date: "2023-09-20",
    readTime: "10 min",
    category: "Basics",
    featured: true
  },
  {
    id: 2,
    title: "Candlestick Patterns Every Trader Should Know",
    description: "Master essential candlestick patterns that provide powerful trading signals and insights.",
    author: "Technical Analyst",
    date: "2023-09-15",
    readTime: "15 min",
    category: "Technical Analysis",
    featured: true
  },
  {
    id: 3,
    title: "How to Read Financial Statements",
    description: "A step-by-step guide to analyzing balance sheets, income statements, and cash flow statements.",
    author: "Financial Advisor",
    date: "2023-09-10",
    readTime: "12 min",
    category: "Fundamental Analysis",
    featured: false
  },
  {
    id: 4,
    title: "Risk Management Strategies for New Traders",
    description: "Essential risk management techniques to protect your capital and improve trading outcomes.",
    author: "Risk Specialist",
    date: "2023-09-05",
    readTime: "8 min",
    category: "Risk Management",
    featured: false
  },
  {
    id: 5,
    title: "Understanding Market Cycles",
    description: "Learn to identify different market cycles and adjust your trading strategy accordingly.",
    author: "Market Strategist",
    date: "2023-09-01",
    readTime: "11 min",
    category: "Market Analysis",
    featured: false
  }
];

// Sample glossary terms
const glossaryTerms = [
  {
    term: "Bull Market",
    definition: "A financial market in which prices are rising or expected to rise. This term is most often used to refer to the stock market but can be applied to anything that is traded, such as bonds, real estate, currencies, and commodities."
  },
  {
    term: "Bear Market",
    definition: "A market condition in which the prices of securities are falling or are expected to fall. The term 'bear market' is typically used to refer to the stock market but can apply to any security that is trading, such as bonds, real estate, currencies, and commodities."
  },
  {
    term: "Dividend",
    definition: "A dividend is a distribution of a portion of a company's earnings, decided by the board of directors, to a class of its shareholders. Dividends can be issued as cash payments, as shares of stock, or other property."
  },
  {
    term: "Market Capitalization",
    definition: "The total market value of a company's outstanding shares. Market capitalization is calculated by multiplying a company's shares outstanding by the current market price of one share."
  },
  {
    term: "P/E Ratio",
    definition: "The Price-to-Earnings Ratio is a valuation ratio of a company's current share price compared to its per-share earnings. It is calculated as: Market Value per Share / Earnings per Share."
  },
  {
    term: "Volatility",
    definition: "A statistical measure of the dispersion of returns for a given security or market index. In most cases, the higher the volatility, the riskier the security."
  },
  {
    term: "Volume",
    definition: "The number of shares or contracts traded in a security or an entire market during a given period of time. It is an important indicator in technical analysis as it is used to measure the worth of a market move."
  },
  {
    term: "Liquidity",
    definition: "The degree to which an asset or security can be quickly bought or sold in the market without affecting the asset's price. Cash is considered the most liquid asset, while real estate, fine art and collectibles are all relatively illiquid."
  },
  {
    term: "Blue Chip Stocks",
    definition: "Shares of large, well-established and financially sound companies with an excellent reputation. These companies typically have a long record of paying stable or rising dividends."
  },
  {
    term: "Day Trading",
    definition: "The practice of buying and selling a financial instrument within the same trading day, such that all positions are closed before the market closes for the trading day."
  }
];

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedLetter, setSelectedLetter] = useState('All');
  
  // Filter glossary terms based on selected letter
  const filteredTerms = glossaryTerms.filter(item => {
    if (selectedLetter === 'All') return true;
    return item.term.charAt(0).toUpperCase() === selectedLetter;
  });
  
  // Generate alphabet for glossary
  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <GraduationCap className="h-8 w-8 mr-3 text-primary" />
                  Learning Center
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Enhance your trading knowledge with educational resources, tutorials, and market insights designed for traders of all levels.
                </p>
              </div>
              
              <div className="w-full md:w-72">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tutorials, guides..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="courses" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Courses
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Articles
                </TabsTrigger>
                <TabsTrigger value="glossary" className="flex items-center gap-1">
                  <BookText className="h-4 w-4" />
                  Glossary
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Resources
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {learningPaths.map((path) => (
                    <Card key={path.id} className="overflow-hidden flex flex-col">
                      <div className="h-44 overflow-hidden">
                        <img 
                          src={path.image} 
                          alt={path.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge>{path.level}</Badge>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {path.duration}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{path.completedModules} of {path.modules} modules</span>
                          <span>{Math.round((path.completedModules / path.modules) * 100)}%</span>
                        </div>
                        <Progress value={(path.completedModules / path.modules) * 100} className="h-2" />
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button className="w-full flex items-center justify-center gap-1">
                          {path.completedModules > 0 ? 'Continue Learning' : 'Start Learning'}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Featured Tutorials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="col-span-1 md:col-span-2 flex overflow-hidden">
                      <div className="w-1/3 bg-primary/20 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-primary" />
                      </div>
                      <div className="w-2/3 p-6">
                        <Badge className="mb-2">Featured</Badge>
                        <h3 className="text-xl font-bold mb-2">Introduction to Technical Analysis</h3>
                        <p className="text-muted-foreground mb-4">
                          Learn the fundamentals of technical analysis and how to apply chart patterns in your trading strategy.
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            45 minutes
                          </div>
                          <Button size="sm">Watch Now</Button>
                        </div>
                      </div>
                    </Card>
                    
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/50 h-14 w-14 flex items-center justify-center rounded-md shrink-0">
                            <BarChart3 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Understanding Candlestick Patterns</h4>
                            <p className="text-sm text-muted-foreground mb-2">Learn to read price action through candlestick formations</p>
                            <Button variant="link" className="h-auto p-0 text-primary">Watch Tutorial</Button>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/50 h-14 w-14 flex items-center justify-center rounded-md shrink-0">
                            <LineChart className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Using Moving Averages Effectively</h4>
                            <p className="text-sm text-muted-foreground mb-2">How to use moving averages to identify trends and entry points</p>
                            <Button variant="link" className="h-auto p-0 text-primary">Watch Tutorial</Button>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/50 h-14 w-14 flex items-center justify-center rounded-md shrink-0">
                            <TrendingUp className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Risk Management Fundamentals</h4>
                            <p className="text-sm text-muted-foreground mb-2">Essential principles for preserving your trading capital</p>
                            <Button variant="link" className="h-auto p-0 text-primary">Watch Tutorial</Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="articles">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                      <div className="h-72 overflow-hidden">
                        <img 
                          src="https://via.placeholder.com/1200x600/3498db/ffffff?text=Featured+Article" 
                          alt="Featured Article"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                          <Badge>Featured</Badge>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <CardTitle className="text-2xl">A Beginner's Guide to Indian Stock Market</CardTitle>
                        <CardDescription className="text-base">
                          Everything you need to know to get started with investing in the Indian stock market - from opening a demat account to placing your first trade.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>20 min read</span>
                          </div>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-sm">By Market Expert</span>
                        </div>
                        <p className="text-muted-foreground">
                          The Indian stock market has seen tremendous growth over the past decade, offering opportunities for both short-term traders and long-term investors. This comprehensive guide walks you through the basics of the Indian markets, including key indices, major exchanges, regulatory frameworks, and practical steps to start your investing journey...
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="ml-auto">Read Full Article</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <Badge variant="outline">{articles[0].category}</Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {articles[0].readTime} read
                          </div>
                        </div>
                        <CardTitle className="text-lg">{articles[0].title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {articles[0].description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          By {articles[0].author} • {articles[0].date}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="link" className="p-0 h-auto ml-auto">
                          Read Article
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <Badge variant="outline">{articles[1].category}</Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {articles[1].readTime} read
                          </div>
                        </div>
                        <CardTitle className="text-lg">{articles[1].title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {articles[1].description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          By {articles[1].author} • {articles[1].date}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="link" className="p-0 h-auto ml-auto">
                          Read Article
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Button variant="outline" className="w-full">View All Articles</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.slice(2).map((article) => (
                    <Card key={article.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime} read
                          </div>
                        </div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {article.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          By {article.author} • {article.date}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t justify-end">
                        <Button size="sm">Read Article</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="glossary">
                <Card>
                  <CardHeader>
                    <CardTitle>Trading & Investment Terms</CardTitle>
                    <CardDescription>
                      A comprehensive glossary of financial terms and concepts to help you understand trading terminology.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex overflow-x-auto space-x-1 py-2 mb-6">
                      {alphabet.map(letter => (
                        <Button 
                          key={letter} 
                          variant={selectedLetter === letter ? "default" : "outline"} 
                          size="sm"
                          className="min-w-[36px] rounded-full px-3"
                          onClick={() => setSelectedLetter(letter)}
                        >
                          {letter}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-6">
                      {filteredTerms.length > 0 ? (
                        filteredTerms.map((item, index) => (
                          <div key={item.term} className={index > 0 ? "pt-4 border-t" : ""}>
                            <h3 className="font-bold text-lg mb-2">{item.term}</h3>
                            <p className="text-muted-foreground">{item.definition}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <BookText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Terms Found</h3>
                          <p className="text-muted-foreground mb-4">
                            There are no terms starting with the letter "{selectedLetter}".
                          </p>
                          <Button onClick={() => setSelectedLetter('All')}>
                            View All Terms
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Trading Guides & eBooks
                      </CardTitle>
                      <CardDescription>
                        Downloadable resources to enhance your trading knowledge
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "Beginner's Guide to Stock Market Investing",
                          "Technical Analysis Handbook",
                          "Options Trading Strategies",
                          "Risk Management for Traders",
                          "Understanding Financial Statements"
                        ].map((resource) => (
                          <div key={resource} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/30">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{resource}</span>
                            </div>
                            <Button size="sm" className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="outline" className="w-full">View All Resources</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Trading Checklists & Templates
                      </CardTitle>
                      <CardDescription>
                        Tools to improve your trading discipline and analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "Pre-Trade Checklist",
                          "Trade Journal Template",
                          "Position Sizing Calculator",
                          "Stock Screening Criteria",
                          "Technical Analysis Worksheet"
                        ].map((template) => (
                          <div key={template} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/30">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{template}</span>
                            </div>
                            <Button size="sm" className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="outline" className="w-full">View All Templates</Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Tax & Compliance Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tax Documentation Guide</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Learn about the tax implications of trading and investing in India, including necessary documentation and filing requirements.
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>Capital Gains Tax Guide</span>
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>Equity Trading Tax Guide</span>
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>F&O Trading Tax Guide</span>
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button className="w-full">Download Complete Guide</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tax Calculator Tools</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Interactive tools to help you calculate your tax liability from different types of trading activities.
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>STCG Calculator</span>
                            <Button size="sm" variant="ghost">Use Tool</Button>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>LTCG Calculator</span>
                            <Button size="sm" variant="ghost">Use Tool</Button>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>Intraday Trading Tax</span>
                            <Button size="sm" variant="ghost">Use Tool</Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button className="w-full">Access All Calculators</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tax Forms & Templates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Download necessary forms and templates for Indian tax compliance related to stock market and investment activities.
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>P&L Statement Template</span>
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>Trading Activity Summary</span>
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <span>Tax Audit Checklist</span>
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button className="w-full">Download All Forms</Button>
                      </CardFooter>
                    </Card>
                  </div>
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

export default Learn;
