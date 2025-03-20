import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  MoreHorizontal,
  Edit,
  Trash,
  Send,
  Filter,
  UserCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
  comments: Comment[];
  category: 'general' | 'stocks' | 'crypto' | 'analysis';
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
}

const currentUser = {
  id: 'user1',
  name: 'John Doe',
  avatar: ''
};

const initialPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: ''
    },
    title: 'Market Outlook for 2023',
    content: 'What are your thoughts on the market for the rest of 2023? I\'m seeing some bearish signals in tech stocks, but financials seem to be holding steady. Any insights?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    likes: 24,
    dislikes: 3,
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user3',
          name: 'Michael Johnson',
          avatar: ''
        },
        content: 'I agree with your assessment on tech. I\'m reducing my exposure to high-growth tech stocks and focusing more on value plays for now.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 8,
        dislikes: 1
      }
    ],
    category: 'general'
  },
  {
    id: '2',
    author: {
      id: 'user4',
      name: 'Robert Chen',
      avatar: ''
    },
    title: 'Bitcoin Analysis - Support Levels',
    content: 'After the recent correction, BTC seems to have found support around $60K. The RSI is showing oversold conditions on the 4H chart, and we might see a bounce back to $65K soon. Thoughts?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 42,
    dislikes: 7,
    comments: [],
    category: 'crypto'
  },
  {
    id: '3',
    author: {
      id: 'user1',
      name: 'John Doe',
      avatar: ''
    },
    title: 'HDFC Bank Technical Analysis',
    content: 'HDFC Bank is approaching a key resistance level at ₹1,650. Volume has been increasing on up days, suggesting strong buying interest. If it breaks above this level, we could see a move to ₹1,750 in the short term.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    likes: 16,
    dislikes: 2,
    comments: [
      {
        id: 'c2',
        author: {
          id: 'user5',
          name: 'Priya Sharma',
          avatar: ''
        },
        content: 'Great analysis! I\'m also watching this stock closely. The banking sector looks strong overall.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
        likes: 5,
        dislikes: 0
      },
      {
        id: 'c3',
        author: {
          id: 'user2',
          name: 'Jane Smith',
          avatar: ''
        },
        content: 'Do you think the recent RBI policy changes will impact banking stocks in the short term?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        likes: 3,
        dislikes: 0
      }
    ],
    category: 'stocks'
  }
];

const Community = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('community_posts');
    return savedPosts ? JSON.parse(savedPosts) : initialPosts;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<Post['category']>('general');
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('community_posts', JSON.stringify(posts));
  }, [posts]);
  
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);
  
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error('Please enter both a title and content for your post');
      return;
    }
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      title: newPostTitle,
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
      comments: [],
      category: newPostCategory
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('general');
    setIsNewPostDialogOpen(false);
    toast.success('Post created successfully');
  };
  
  const handleUpdatePost = () => {
    if (!editingPost) return;
    
    if (!editingPost.title.trim() || !editingPost.content.trim()) {
      toast.error('Please enter both a title and content for your post');
      return;
    }
    
    setPosts(prev => prev.map(post => 
      post.id === editingPost.id ? { ...editingPost, timestamp: new Date() } : post
    ));
    
    setEditingPost(null);
    toast.success('Post updated successfully');
  };
  
  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    }
  };
  
  const handleAddComment = (postId: string) => {
    const commentContent = newComment[postId];
    
    if (!commentContent?.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: commentContent,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0
    };
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newCommentObj] } 
        : post
    ));
    
    setNewComment(prev => ({ ...prev, [postId]: '' }));
    toast.success('Comment added successfully');
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return `${diffSecs} sec ago`;
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    
    return new Date(date).toLocaleDateString();
  };
  
  const handleLike = (postId: string, commentId?: string) => {
    if (commentId) {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.map(comment => 
                comment.id === commentId 
                  ? { ...comment, likes: comment.likes + 1 } 
                  : comment
              )
            } 
          : post
      ));
    } else {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      ));
    }
  };
  
  const handleDislike = (postId: string, commentId?: string) => {
    if (commentId) {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.map(comment => 
                comment.id === commentId 
                  ? { ...comment, dislikes: comment.dislikes + 1 } 
                  : comment
              )
            } 
          : post
      ));
    } else {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, dislikes: post.dislikes + 1 } 
          : post
      ));
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Community</h1>
            
            <div className="flex items-center gap-4">
              <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create Post</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Share your thoughts, analysis, or questions with the community.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="post-title" className="text-sm font-medium">Title</label>
                      <Input
                        id="post-title"
                        placeholder="Enter a title for your post"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="post-category" className="text-sm font-medium">Category</label>
                      <select
                        id="post-category"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value as Post['category'])}
                      >
                        <option value="general">General Discussion</option>
                        <option value="stocks">Stocks</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="analysis">Technical Analysis</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="post-content" className="text-sm font-medium">Content</label>
                      <Textarea
                        id="post-content"
                        placeholder="Share your thoughts..."
                        className="min-h-[200px]"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewPostDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>
                      Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>
                      Make changes to your post.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {editingPost && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="edit-post-title" className="text-sm font-medium">Title</label>
                        <Input
                          id="edit-post-title"
                          placeholder="Enter a title for your post"
                          value={editingPost.title}
                          onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="edit-post-category" className="text-sm font-medium">Category</label>
                        <select
                          id="edit-post-category"
                          className="w-full p-2 rounded-md border border-input bg-background"
                          value={editingPost.category}
                          onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as Post['category'] })}
                        >
                          <option value="general">General Discussion</option>
                          <option value="stocks">Stocks</option>
                          <option value="crypto">Cryptocurrency</option>
                          <option value="analysis">Technical Analysis</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="edit-post-content" className="text-sm font-medium">Content</label>
                        <Textarea
                          id="edit-post-content"
                          placeholder="Share your thoughts..."
                          className="min-h-[200px]"
                          value={editingPost.content}
                          onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingPost(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdatePost}>
                      Update
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Latest</span>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Posted by {post.author.name} • {formatDate(new Date(post.timestamp))}
                            </p>
                          </div>
                        </div>
                        
                        {post.author.id === currentUser.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingPost(post)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="whitespace-pre-line">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-0 pb-3">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleLike(post.id)}>
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleDislike(post.id)}>
                          <ThumbsDown className="w-4 h-4" />
                          <span>{post.dislikes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments.length}</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </Button>
                    </CardFooter>
                    
                    {post.comments.length > 0 && (
                      <div className="px-6 pb-4 border-t pt-3">
                        <h3 className="text-sm font-medium mb-3">Comments</h3>
                        <ScrollArea className="max-h-[300px]">
                          <div className="space-y-4">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="border-b pb-3 last:border-0">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={comment.author.avatar} />
                                    <AvatarFallback>
                                      {comment.author.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium">{comment.author.name}</p>
                                      <p className="text-xs text-muted-foreground">{formatDate(new Date(comment.timestamp))}</p>
                                    </div>
                                    <p className="text-sm mt-1">{comment.content}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleLike(post.id, comment.id)}>
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{comment.likes}</span>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleDislike(post.id, comment.id)}>
                                        <ThumbsDown className="w-3 h-3" />
                                        <span>{comment.dislikes}</span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    
                    <div className="px-6 pb-4 pt-2 border-t flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleAddComment(post.id)}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                    <h3 className="text-lg font-medium">No posts yet</h3>
                    <p className="text-muted-foreground">Be the first to start a discussion!</p>
                    <Button className="mt-4" onClick={() => setIsNewPostDialogOpen(true)}>
                      Create Post
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="general" className="mt-0">
              {filteredPosts.filter(post => post.category === 'general').map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Posted by {post.author.name} • {formatDate(new Date(post.timestamp))}
                          </p>
                        </div>
                      </div>
                      
                      {post.author.id === currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingPost(post)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="whitespace-pre-line">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0 pb-3">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleLike(post.id)}>
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleDislike(post.id)}>
                        <ThumbsDown className="w-4 h-4" />
                        <span>{post.dislikes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </CardFooter>
                  
                  {post.comments.length > 0 && (
                    <div className="px-6 pb-4 border-t pt-3">
                      <h3 className="text-sm font-medium mb-3">Comments</h3>
                      <ScrollArea className="max-h-[300px]">
                        <div className="space-y-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-3 last:border-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback>
                                    {comment.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(new Date(comment.timestamp))}</p>
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleLike(post.id, comment.id)}>
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>{comment.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleDislike(post.id, comment.id)}>
                                      <ThumbsDown className="w-3 h-3" />
                                      <span>{comment.dislikes}</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  <div className="px-6 pb-4 pt-2 border-t flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleAddComment(post.id)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="stocks" className="mt-0">
              {filteredPosts.filter(post => post.category === 'stocks').map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Posted by {post.author.name} • {formatDate(new Date(post.timestamp))}
                          </p>
                        </div>
                      </div>
                      
                      {post.author.id === currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingPost(post)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="whitespace-pre-line">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0 pb-3">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleLike(post.id)}>
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleDislike(post.id)}>
                        <ThumbsDown className="w-4 h-4" />
                        <span>{post.dislikes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </CardFooter>
                  
                  {post.comments.length > 0 && (
                    <div className="px-6 pb-4 border-t pt-3">
                      <h3 className="text-sm font-medium mb-3">Comments</h3>
                      <ScrollArea className="max-h-[300px]">
                        <div className="space-y-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-3 last:border-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback>
                                    {comment.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(new Date(comment.timestamp))}</p>
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleLike(post.id, comment.id)}>
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>{comment.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleDislike(post.id, comment.id)}>
                                      <ThumbsDown className="w-3 h-3" />
                                      <span>{comment.dislikes}</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  <div className="px-6 pb-4 pt-2 border-t flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleAddComment(post.id)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="crypto" className="mt-0">
              {filteredPosts.filter(post => post.category === 'crypto').map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Posted by {post.author.name} • {formatDate(new Date(post.timestamp))}
                          </p>
                        </div>
                      </div>
                      
                      {post.author.id === currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingPost(post)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="whitespace-pre-line">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0 pb-3">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleLike(post.id)}>
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleDislike(post.id)}>
                        <ThumbsDown className="w-4 h-4" />
                        <span>{post.dislikes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </CardFooter>
                  
                  {post.comments.length > 0 && (
                    <div className="px-6 pb-4 border-t pt-3">
                      <h3 className="text-sm font-medium mb-3">Comments</h3>
                      <ScrollArea className="max-h-[300px]">
                        <div className="space-y-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-3 last:border-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback>
                                    {comment.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(new Date(comment.timestamp))}</p>
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleLike(post.id, comment.id)}>
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>{comment.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1" onClick={() => handleDislike(post.id, comment.id)}>
                                      <ThumbsDown className="w-3 h-3" />
                                      <span>{comment.dislikes}</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  <div className="px-6 pb-4 pt-2 border-t flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleAddComment(post.id)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0">
              {filteredPosts.filter(post => post.category === 'analysis

