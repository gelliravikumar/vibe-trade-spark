
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  MessageCircle, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  BarChart2, 
  Bookmark,
  Users,
  Trending,
  Clock,
  Filter,
  PlusCircle,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    handle: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
}

const initialPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Rahul Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      handle: '@rahulsharma'
    },
    content: "Just bought some $BTC at the dip! Looking forward to the halving event next month. What are your price predictions? #Bitcoin #Crypto #Trading",
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    tags: ['Bitcoin', 'Crypto', 'Trading']
  },
  {
    id: '2',
    user: {
      name: 'Priya Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      handle: '@priyapatel'
    },
    content: "I've been researching $ETH for my portfolio. The upcoming ETH 2.0 upgrade seems promising for scalability. Any thoughts from the community? #Ethereum #DeFi",
    timestamp: '5 hours ago',
    likes: 32,
    comments: 12,
    shares: 7,
    isLiked: true,
    isBookmarked: true,
    tags: ['Ethereum', 'DeFi']
  },
  {
    id: '3',
    user: {
      name: 'Amit Verma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      handle: '@amitverma'
    },
    content: "Just set up my first hardware wallet! Feels great to truly own my crypto. Any security tips I should be aware of? #Security #Crypto #HardwareWallet",
    timestamp: '1 day ago',
    likes: 45,
    comments: 23,
    shares: 5,
    isLiked: false,
    isBookmarked: true,
    tags: ['Security', 'Crypto', 'HardwareWallet']
  },
  {
    id: '4',
    user: {
      name: 'Sneha Gupta',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
      handle: '@snehagupta'
    },
    content: "Analysis: The INR to crypto volumes have increased by 45% in the last quarter. Indian traders are becoming more active! What do you think about the Indian crypto market? #India #CryptoTrading",
    timestamp: '2 days ago',
    likes: 62,
    comments: 18,
    shares: 14,
    isLiked: true,
    isBookmarked: false,
    tags: ['India', 'CryptoTrading']
  }
];

const Community = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };
  
  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
    
    toast.success("Post saved to your bookmarks!");
  };

  const handleComment = (postId: string) => {
    toast.info("Comments feature coming soon!");
  };

  const handleShare = (postId: string) => {
    toast.info("Share feature coming soon!");
  };

  const handleNewPost = () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter some content for your post.");
      return;
    }
    
    // Extract hashtags
    const tags = newPostContent.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [];
    
    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        handle: '@you'
      },
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      tags
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success("Post published successfully!");
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast.success("Post deleted successfully!");
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community</h1>
              <p className="text-muted-foreground">
                Connect with traders, share insights, and learn from the community
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Share your thoughts, ideas, or market insights..."
                    className="resize-none mb-4"
                    rows={3}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Use #hashtags to categorize your post
                    </div>
                    <Button onClick={handleNewPost}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="all">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="all" className="flex-grow">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    All Posts
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex-grow">
                    <Trending className="w-4 h-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex-grow">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="bookmarks" className="flex-grow">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarked
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <img src={post.user.avatar} alt={post.user.name} />
                              </Avatar>
                              <div>
                                <div className="font-semibold">{post.user.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span>{post.user.handle}</span>
                                  <span>•</span>
                                  <span>{post.timestamp}</span>
                                </div>
                              </div>
                            </div>
                            
                            {post.user.handle === '@you' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    •••
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Post?</DialogTitle>
                                    <DialogDescription>
                                      This action cannot be undone. The post will be permanently deleted.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(post.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="whitespace-pre-wrap">{post.content}</p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(post.id)}
                            className={post.isLiked ? "text-primary" : ""}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleComment(post.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.shares}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className={post.isBookmarked ? "text-primary" : ""}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 pb-6 text-center">
                        <p className="text-muted-foreground">No posts found matching your search.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="trending" className="space-y-4">
                  {filteredPosts
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .map(post => (
                      <Card key={post.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <img src={post.user.avatar} alt={post.user.name} />
                            </Avatar>
                            <div>
                              <div className="font-semibold">{post.user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{post.user.handle}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p>{post.content}</p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(post.id)}
                            className={post.isLiked ? "text-primary" : ""}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleComment(post.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.shares}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className={post.isBookmarked ? "text-primary" : ""}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  {filteredPosts
                    .filter(post => post.content.toLowerCase().includes('analysis') || 
                                    post.tags.some(tag => tag.includes('Analysis')))
                    .map(post => (
                      <Card key={post.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <img src={post.user.avatar} alt={post.user.name} />
                            </Avatar>
                            <div>
                              <div className="font-semibold">{post.user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{post.user.handle}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p>{post.content}</p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(post.id)}
                            className={post.isLiked ? "text-primary" : ""}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleComment(post.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.shares}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className={post.isBookmarked ? "text-primary" : ""}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </TabsContent>
                
                <TabsContent value="bookmarks" className="space-y-4">
                  {filteredPosts
                    .filter(post => post.isBookmarked)
                    .map(post => (
                      <Card key={post.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <img src={post.user.avatar} alt={post.user.name} />
                            </Avatar>
                            <div>
                              <div className="font-semibold">{post.user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{post.user.handle}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p>{post.content}</p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(post.id)}
                            className={post.isLiked ? "text-primary" : ""}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleComment(post.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.shares}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className={post.isBookmarked ? "text-primary" : ""}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trending className="w-5 h-5 mr-2" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">#Bitcoin</div>
                      <div className="text-sm text-muted-foreground">2.5K posts</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">#DeFi</div>
                      <div className="text-sm text-muted-foreground">1.8K posts</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">#Altcoins</div>
                      <div className="text-sm text-muted-foreground">1.2K posts</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">#NFT</div>
                      <div className="text-sm text-muted-foreground">950 posts</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">#TradingTips</div>
                      <div className="text-sm text-muted-foreground">780 posts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Who to Follow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Crypto Expert', handle: '@cryptoexpert', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert' },
                      { name: 'Trader Pro', handle: '@traderpro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trader' },
                      { name: 'Market Analyst', handle: '@marketanalyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Analyst' }
                    ].map((profile, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <img src={profile.avatar} alt={profile.name} />
                          </Avatar>
                          <div>
                            <div className="font-semibold">{profile.name}</div>
                            <div className="text-sm text-muted-foreground">{profile.handle}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Latest Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary pl-4 pb-4">
                      <p className="font-medium">Rahul Sharma posted about Bitcoin</p>
                      <p className="text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4 pb-4">
                      <p className="font-medium">Priya Patel commented on Ethereum analysis</p>
                      <p className="text-muted-foreground">5 hours ago</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                      <p className="font-medium">New market report published</p>
                      <p className="text-muted-foreground">yesterday</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
