
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Users, 
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

// Sample discussions data
const discussions = [
  {
    id: 1,
    title: "What's your take on the recent RBI policy decisions?",
    content: "The Reserve Bank of India kept the repo rate unchanged at 6.5%. How do you think this will impact the stock market in the short term?",
    author: {
      name: "Paisa Raja",
      avatar: "/placeholder.svg",
      role: "Verified Trader"
    },
    category: "Economy",
    tags: ["RBI", "Monetary Policy", "Interest Rates"],
    likes: 42,
    comments: 18,
    shares: 5,
    createdAt: "2023-10-06T09:30:00Z"
  },
  {
    id: 2,
    title: "Best trading strategy for volatile markets?",
    content: "With the current market volatility, what strategies are you using to protect your portfolio while still finding opportunities?",
    author: {
      name: "Market Guru",
      avatar: "/placeholder.svg",
      role: "Expert Analyst"
    },
    category: "Trading",
    tags: ["Volatility", "Strategy", "Risk Management"],
    likes: 37,
    comments: 24,
    shares: 8,
    createdAt: "2023-10-05T15:45:00Z"
  },
  {
    id: 3,
    title: "Technical Analysis vs Fundamental Analysis - Which do you prefer?",
    content: "I've been using both approaches but find myself leaning more towards technical analysis for short-term trades. What's your preference and why?",
    author: {
      name: "Chart Master",
      avatar: "/placeholder.svg",
      role: "Technical Analyst"
    },
    category: "Analysis",
    tags: ["Technical Analysis", "Fundamental Analysis", "Trading"],
    likes: 56,
    comments: 32,
    shares: 12,
    createdAt: "2023-10-04T11:20:00Z"
  },
  {
    id: 4,
    title: "Is anyone looking at small cap stocks in manufacturing sector?",
    content: "With the government's push for Make in India, I'm seeing good potential in small cap manufacturing stocks. Anyone else exploring this space?",
    author: {
      name: "Value Hunter",
      avatar: "/placeholder.svg",
      role: "Value Investor"
    },
    category: "Stocks",
    tags: ["Small Cap", "Manufacturing", "Value Investing"],
    likes: 29,
    comments: 15,
    shares: 3,
    createdAt: "2023-10-03T13:10:00Z"
  }
];

// Sample events data
const events = [
  {
    id: 1,
    title: "Investors Roundtable: Market Outlook 2023",
    description: "Join top financial experts as they discuss market trends and provide their outlook for the remainder of 2023.",
    date: "2023-10-15T10:00:00Z",
    duration: "2 hours",
    type: "Webinar",
    host: "TradeSmart Education",
    attendees: 156,
    image: "https://via.placeholder.com/800x400/3498db/ffffff?text=Investors+Roundtable"
  },
  {
    id: 2,
    title: "Technical Analysis Masterclass",
    description: "Learn advanced chart patterns and technical indicators to improve your trading decisions.",
    date: "2023-10-20T14:30:00Z",
    duration: "3 hours",
    type: "Workshop",
    host: "Chart Masters Academy",
    attendees: 89,
    image: "https://via.placeholder.com/800x400/27ae60/ffffff?text=Technical+Analysis"
  },
  {
    id: 3,
    title: "Cryptocurrency Investment Strategies",
    description: "Explore different strategies for investing in cryptocurrencies and building a balanced digital asset portfolio.",
    date: "2023-10-25T16:00:00Z",
    duration: "1.5 hours",
    type: "Webinar",
    host: "Crypto Insights",
    attendees: 210,
    image: "https://via.placeholder.com/800x400/8e44ad/ffffff?text=Crypto+Strategies"
  }
];

// Sample leaderboard data
const leaderboard = [
  {
    rank: 1,
    name: "Paisa Raja",
    avatar: "/placeholder.svg",
    returns: 32.5,
    winRate: 78,
    followers: 1245
  },
  {
    rank: 2,
    name: "Market Guru",
    avatar: "/placeholder.svg",
    returns: 28.7,
    winRate: 72,
    followers: 987
  },
  {
    rank: 3,
    name: "Value Hunter",
    avatar: "/placeholder.svg",
    returns: 25.3,
    winRate: 69,
    followers: 756
  },
  {
    rank: 4,
    name: "Technical Wizard",
    avatar: "/placeholder.svg",
    returns: 23.8,
    winRate: 65,
    followers: 621
  },
  {
    rank: 5,
    name: "Momentum Trader",
    avatar: "/placeholder.svg",
    returns: 21.2,
    winRate: 62,
    followers: 543
  }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      toast.success("Your post has been shared with the community!");
      setNewPost('');
    } else {
      toast.error("Please enter some content for your post");
    }
  };
  
  const handleInteraction = (type, id) => {
    toast.success(`You ${type === 'like' ? 'liked' : type === 'comment' ? 'commented on' : 'shared'} a post!`);
  };
  
  const handleEventRSVP = (id) => {
    toast.success("You've registered for this event! Check your email for details.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Users className="h-8 w-8 mr-3 text-primary" />
                  Trading Community
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Connect with fellow traders, share insights, participate in discussions, and learn from the community.
                </p>
              </div>
              
              <div className="w-full md:w-72">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search community..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>{activeTab === 'discussions' ? 'New Post' : activeTab === 'events' ? 'Create Event' : 'Follow Top Traders'}</span>
                  </Button>
                </div>
              </div>
              
              <TabsContent value="discussions">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Share your thoughts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostSubmit}>
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt="Profile" />
                          <AvatarFallback>PR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea 
                            placeholder="What's on your mind about the markets today?" 
                            className="w-full min-h-[100px]" 
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                          />
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="sm" className="text-xs">
                                Add Image
                              </Button>
                              <Button type="button" variant="outline" size="sm" className="text-xs">
                                Add Poll
                              </Button>
                            </div>
                            <Button type="submit" className="flex items-center gap-1">
                              <Send className="h-4 w-4" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                              <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{discussion.author.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Badge variant="outline" className="text-[10px] py-0 h-4">
                                  {discussion.author.role}
                                </Badge>
                                <span>•</span>
                                <span>{formatDate(discussion.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge>{discussion.category}</Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">{discussion.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{discussion.content}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <div className="flex gap-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-muted-foreground"
                            onClick={() => handleInteraction('like', discussion.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{discussion.likes}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-muted-foreground"
                            onClick={() => handleInteraction('comment', discussion.id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.comments}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-muted-foreground"
                            onClick={() => handleInteraction('share', discussion.id)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span>{discussion.shares}</span>
                          </Button>
                        </div>
                        <Button variant="outline" size="sm">View Discussion</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline">Load More Discussions</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden flex flex-col">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                          <Badge>{event.type}</Badge>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.attendees} attending
                          </div>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            {formatTime(event.date)} ({event.duration})
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            Hosted by: {event.host}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button 
                          className="w-full" 
                          onClick={() => handleEventRSVP(event.id)}
                        >
                          Register Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline">View All Events</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="leaderboard">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Top Traders This Month
                      </CardTitle>
                      <Button variant="outline" size="sm">View Full Rankings</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-muted-foreground text-sm">
                            <th className="py-3 text-left">Rank</th>
                            <th className="py-3 text-left">Trader</th>
                            <th className="py-3 text-right">Returns</th>
                            <th className="py-3 text-right">Win Rate</th>
                            <th className="py-3 text-right">Followers</th>
                            <th className="py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((trader) => (
                            <tr key={trader.rank} className="border-b hover:bg-muted/50">
                              <td className="py-4">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                  trader.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                                  trader.rank === 2 ? 'bg-gray-300/20 text-gray-400' : 
                                  trader.rank === 3 ? 'bg-amber-700/20 text-amber-700' : 
                                  'bg-muted/20 text-muted-foreground'
                                } font-semibold text-sm`}>
                                  {trader.rank}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={trader.avatar} alt={trader.name} />
                                    <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{trader.name}</span>
                                </div>
                              </td>
                              <td className="py-4 text-right text-success font-medium">
                                +{trader.returns}%
                              </td>
                              <td className="py-4 text-right">
                                {trader.winRate}%
                              </td>
                              <td className="py-4 text-right">
                                {trader.followers.toLocaleString()}
                              </td>
                              <td className="py-4 text-right">
                                <Button size="sm" variant="outline">
                                  Follow
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Most Profitable Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Swing Trading', 'Value Investing', 'Momentum Trading', 'Growth Investing', 'Dividend Investing'].map((strategy, i) => (
                          <div key={strategy} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {i + 1}
                              </span>
                              <span className="font-medium">{strategy}</span>
                            </div>
                            <span className="text-success font-medium">
                              +{Math.round(30 - i * 3.5)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Hot Discussions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "What's your view on small-cap IT stocks?",
                          "Long-term outlook for renewable energy sector",
                          "Strategies for trading during earnings season",
                          "Impact of global recession on Indian markets",
                          "Best sectors to invest in for next 5 years"
                        ].map((topic, i) => (
                          <div key={topic} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{topic}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(50 - i * 7)} comments
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

export default Community;
