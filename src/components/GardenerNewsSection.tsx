
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { PostCard } from './news/PostCard';
import { PaginationControls } from './ui/pagination-controls';
import { samplePosts, sampleComments } from './news/sampleData';
import { formatDate, formatTime } from './news/utils';

interface GardenerPost {
  id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  garden_location?: string;
  created_at: string;
  gardener: {
    id: string;
    name: string;
    avatar_url?: string;
    location?: string;
    experience?: string;
    services?: string[];
    rating?: number;
  };
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_name: string;
  avatar_url?: string;
}

const POSTS_PER_PAGE = 10;

const GardenerNewsSection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<GardenerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get current page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    // Simulate loading and use sample data with pagination
    setTimeout(() => {
      const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const paginatedPosts = samplePosts.slice(startIndex, endIndex);
      
      setPosts(paginatedPosts);
      setComments(sampleComments);
      setTotalPages(Math.ceil(samplePosts.length / POSTS_PER_PAGE));
      setLoading(false);
    }, 1000);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.is_liked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    const userName = user?.email?.split('@')[0] || 'Anonymous User';
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment.trim(),
      created_at: new Date().toISOString(),
      user_name: userName,
      avatar_url: user ? '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png' : undefined,
    };

    // Update local state
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj]
    }));

    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, comments_count: p.comments_count + 1 }
        : p
    ));
    
    setNewComment('');

    if (user) {
      try {
        await supabase
          .from('post_comments')
          .insert({
            post_id: postId,
            user_id: user.id,
            content: newComment.trim()
          });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleShare = (post: GardenerPost, platform?: string) => {
    // Share functionality is now handled in ShareMenu component
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          آخر الأخبار من البستانيين
        </h1>
        <p className="text-xl text-gray-600">
          تابع أحدث أعمال وتجارب البستانيين المحترفين
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            comments={comments[post.id] || []}
            showComments={showComments === post.id}
            newComment={newComment}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onAddComment={handleAddComment}
            onCommentChange={setNewComment}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">لا توجد منشورات حتى الآن</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default GardenerNewsSection;
