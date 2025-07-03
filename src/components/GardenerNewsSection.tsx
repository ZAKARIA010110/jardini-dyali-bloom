import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, MessageCircle, Share2, Eye, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';

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

const GardenerNewsSection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<GardenerPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch posts with gardener info and interaction counts
      const { data: postsData, error } = await supabase
        .from('gardener_posts')
        .select(`
          *,
          gardener:gardeners(id, name, avatar_url, location, experience, services, rating),
          likes:post_likes(count),
          comments:post_comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Check if user has liked each post
      const postsWithLikes = await Promise.all(
        (postsData || []).map(async (post) => {
          let isLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            isLiked = !!likeData;
          }

          return {
            ...post,
            likes_count: post.likes?.[0]?.count || 0,
            comments_count: post.comments?.[0]?.count || 0,
            is_liked: isLiked,
          };
        })
      );

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
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

  const handleShare = (post: GardenerPost) => {
    if (navigator.share) {
      navigator.share({
        title: `منشور من ${post.gardener.name}`,
        text: post.content,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              {/* Gardener Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.gardener.avatar_url} />
                      <AvatarFallback>
                        {post.gardener.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{post.gardener.name}</h3>
                      <p className="text-gray-600 text-sm">{post.gardener.location}</p>
                      <p className="text-green-600 text-sm">{post.gardener.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Link to={`/gardeners/${post.gardener.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 ml-2" />
                        عرض الملف الشخصي
                      </Button>
                    </Link>
                    <Link to={`/gardeners/${post.gardener.id}`}>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Calendar className="w-4 h-4 ml-2" />
                        احجز الآن
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Services Tags */}
                {post.gardener.services && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.gardener.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-6">
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                
                {post.garden_location && (
                  <p className="text-green-600 mb-4 font-medium">
                    📍 {post.garden_location}
                  </p>
                )}

                {/* Media */}
                {post.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt="Garden work" 
                      className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {post.video_url && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <video 
                      src={post.video_url} 
                      controls 
                      className="w-full h-96 object-cover"
                      poster={post.image_url}
                    />
                  </div>
                )}

                {/* Post Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{formatDate(post.created_at)}</span>
                  {post.gardener.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="mr-1">{post.gardener.rating}</span>
                    </div>
                  )}
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
                        post.is_liked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                      <span>{post.likes_count}</span>
                    </button>

                    <button className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments_count}</span>
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-green-500 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>مشاركة</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">لا توجد منشورات حتى الآن</p>
        </div>
      )}
    </div>
  );
};

export default GardenerNewsSection;