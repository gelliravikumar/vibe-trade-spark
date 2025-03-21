
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Plus, 
  ThumbsUp, 
  Bookmark, 
  MoreHorizontal
} from 'lucide-react';

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Alex Johnson',
        handle: '@alexjohnson',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: 'Just increased my position in $TSLA after the recent dip. Their new AI initiatives look promising for long-term growth. What are your thoughts on the EV market outlook for 2023?',
      timestamp: '2h ago',
      likes: 24,
      comments: 5,
      shares: 3,
      category: 'stocks',
      tags: ['Tesla', 'EV Market', 'Investment Strategy']
    },
    {
      id: 2,
      author: {
        name: 'Sophia Chen',
        handle: '@sophiachen',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      content: 'Bitcoin hitting $60K again! Crypto bull market seems to be in full swing. My strategy is to hold 70% BTC, 20% ETH, and 10% in promising altcoins. How about you? #crypto #bitcoin',
      timestamp: '5h ago',
      likes: 42,
      comments: 11,
      shares: 7,
      category: 'crypto',
      tags: ['Bitcoin', 'Crypto', 'Bull Market']
    },
    {
      id: 3,
      author: {
        name: 'Marcus Williams',
        handle: '@marcuswilliams',
        avatar: 'https://i.pravatar.cc/150?img=8'
      },
      content: "Anyone following the developments with DeFi protocols? I've been yield farming on Aave and Compound with impressive returns. Important to understand the smart contract risks though. Would love to hear about your DeFi experiences!",
      timestamp: '1d ago',
      likes: 18,
      comments: 9,
      shares: 2,
      category: 'defi',
      tags: ['DeFi', 'Yield Farming', 'Smart Contracts']
    }
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    
    const post = {
      id: posts.length + 1,
      author: {
        name: 'Current User',
        handle: '@currentuser',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      category: 'general',
      tags: ['New Post']
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setIsCreatingPost(false);
    toast.success("Post created successfully!");
  };
  
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
    toast("Post liked!");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto flex-grow p-4 md:p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Community</h1>
          <Button onClick={() => setIsCreatingPost(true)} className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>
        
        <Tabs defaultValue="trending" className="mb-8">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="trending">
              <TrendingUp className="mr-2 h-4 w-4" /> Trending
            </TabsTrigger>
            <TabsTrigger value="latest">
              <MessageSquare className="mr-2 h-4 w-4" /> Latest
            </TabsTrigger>
            <TabsTrigger value="following">
              <Users className="mr-2 h-4 w-4" /> Following
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-4">
            <div className="space-y-4">
              {posts.sort((a, b) => b.likes - a.likes).map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="latest" className="mt-4">
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="following" className="mt-4">
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Follow more users to see their posts here.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your insights, questions, or news with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea 
                placeholder="What's on your mind about trading and investments?" 
                className="min-h-[150px]"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingPost(false)}>Cancel</Button>
              <Button onClick={handlePostSubmit}>Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

interface PostCardProps {
  post: {
    id: number;
    author: {
      name: string;
      handle: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    category: string;
    tags: string[];
  };
  onLike: (postId: number) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold">{post.author.name}</CardTitle>
              <CardDescription>{post.author.handle} · {post.timestamp}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-3">{post.content}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">#{tag.replace(/\s/g, '')}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
            <Heart className="mr-1 h-4 w-4" /> {post.likes}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-1 h-4 w-4" /> {post.comments}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-1 h-4 w-4" /> {post.shares}
          </Button>
          <div className="flex-grow"></div>
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Community;
