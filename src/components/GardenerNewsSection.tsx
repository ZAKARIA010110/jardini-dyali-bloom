
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, MessageCircle, Share2, Eye, Calendar, Copy, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

const GardenerNewsSection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<GardenerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);

  // Sample posts for demo
  const samplePosts: GardenerPost[] = [
    {
      id: '1',
      content: 'انتهيت اليوم من تنسيق حديقة رائعة في الرباط! استغرق العمل 3 أيام كاملة وتم زراعة أكثر من 50 نبتة مختلفة. النتيجة مذهلة والعميل سعيد جداً 🌿🌸',
      image_url: '/lovable-uploads/f8dcc078-0f78-4334-95da-bd012d0c5551.png',
      garden_location: 'الرباط، المغرب',
      created_at: '2024-07-03T10:30:00Z',
      gardener: {
        id: '1',
        name: 'أحمد البستاني',
        avatar_url: '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png',
        location: 'الرباط',
        experience: '8 سنوات خبرة',
        services: ['تنسيق الحدائق', 'زراعة الأشجار', 'العناية بالنباتات'],
        rating: 4.8,
      },
      likes_count: 24,
      comments_count: 8,
      is_liked: false,
    },
    {
      id: '2',
      content: 'شاهدوا كيف حولنا هذه المساحة الفارغة إلى حديقة خضراء جميلة! العمل استغرق أسبوعين مع فريقي المتخصص 🌱',
      video_url: '/lovable-uploads/fc834d8b-6d31-44df-a0c8-2d9c1dc2eba2.png',
      garden_location: 'الدار البيضاء، المغرب',
      created_at: '2024-07-02T14:15:00Z',
      gardener: {
        id: '2',
        name: 'فاطمة الزهراء',
        avatar_url: '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png',
        location: 'الدار البيضاء',
        experience: '12 سنة خبرة',
        services: ['تصميم الحدائق', 'أنظمة الري', 'صيانة الحدائق'],
        rating: 4.9,
      },
      likes_count: 45,
      comments_count: 12,
      is_liked: true,
    },
    {
      id: '3',
      content: 'نصائح مهمة لري النباتات في فصل الصيف: 🌞\n1. الري في الصباح الباكر أو المساء\n2. فحص رطوبة التربة قبل الري\n3. استخدام المالش للحفاظ على الرطوبة\n4. تجنب ري الأوراق مباشرة',
      image_url: '/lovable-uploads/f8dcc078-0f78-4334-95da-bd012d0c5551.png',
      garden_location: 'مراكش، المغرب',
      created_at: '2024-07-01T09:45:00Z',
      gardener: {
        id: '3',
        name: 'يوسف الجردي',
        avatar_url: '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png',
        location: 'مراكش',
        experience: '6 سنوات خبرة',
        services: ['نصائح الزراعة', 'العناية بالنباتات', 'تنسيق الحدائق'],
        rating: 4.7,
      },
      likes_count: 18,
      comments_count: 5,
      is_liked: false,
    },
  ];

  // Sample comments for demo
  const sampleComments: { [postId: string]: Comment[] } = {
    '1': [
      {
        id: '1',
        content: 'عمل رائع! أتطلع لرؤية المزيد من إبداعاتك',
        created_at: '2024-07-03T12:30:00Z',
        user_name: 'محمد الحسين',
        avatar_url: '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png',
      },
      {
        id: '2',
        content: 'هل يمكنك مساعدتي في تنسيق حديقتي المنزلية؟',
        created_at: '2024-07-03T13:45:00Z',
        user_name: 'سارة العلوي',
        avatar_url: '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png',
      },
    ],
    '2': [
      {
        id: '3',
        content: 'تحويل مذهل! كم تكلف مثل هذه الأعمال؟',
        created_at: '2024-07-02T16:20:00Z',
        user_name: 'عبد الله المغربي',
        avatar_url: '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png',
      },
    ],
    '3': [
      {
        id: '4',
        content: 'نصائح قيمة جداً، شكراً لك!',
        created_at: '2024-07-01T11:30:00Z',
        user_name: 'Anonymous User',
      },
    ],
  };

  useEffect(() => {
    // Simulate loading and use sample data
    setTimeout(() => {
      setPosts(samplePosts);
      setComments(sampleComments);
      setLoading(false);
    }, 1000);
  }, []);

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
    const postUrl = `${window.location.origin}/news#post-${post.id}`;
    const shareText = `شاهد هذا المنشور من ${post.gardener.name}: ${post.content.substring(0, 100)}...`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(postUrl);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المنشور إلى الحافظة",
      });
      setShowShareMenu(null);
    } else {
      // Toggle share menu
      setShowShareMenu(showShareMenu === post.id ? null : post.id);
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

  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ أقل من ساعة';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return 'منذ يوم واحد';
    return `منذ ${Math.floor(diffInHours / 24)} أيام`;
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
          <Card key={post.id} id={`post-${post.id}`} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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

                    <button 
                      onClick={() => handleComment(post.id)}
                      className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{comments[post.id]?.length || post.comments_count}</span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-green-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>مشاركة</span>
                      </button>

                      {/* Share Menu */}
                      {showShareMenu === post.id && (
                        <div className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-48">
                          <button
                            onClick={() => handleShare(post, 'facebook')}
                            className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            <span>فيسبوك</span>
                          </button>
                          <button
                            onClick={() => handleShare(post, 'twitter')}
                            className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
                          >
                            <Twitter className="w-4 h-4 text-sky-500" />
                            <span>تويتر</span>
                          </button>
                          <button
                            onClick={() => handleShare(post, 'linkedin')}
                            className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
                          >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            <span>لينكد إن</span>
                          </button>
                          <button
                            onClick={() => handleShare(post, 'whatsapp')}
                            className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
                          >
                            <span className="w-4 h-4 text-green-500">📱</span>
                            <span>واتساب</span>
                          </button>
                          <button
                            onClick={() => handleShare(post, 'copy')}
                            className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                            <span>نسخ الرابط</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments === post.id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-4">التعليقات</h4>
                    
                    {/* Add Comment */}
                    <div className="flex gap-3 mb-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user ? '/lovable-uploads/519807c6-1cea-451e-aad5-1a3dd2972dbe.png' : ''} />
                        <AvatarFallback>
                          {user ? user.email?.slice(0, 2).toUpperCase() : 'أ'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="اكتب تعليقاً..."
                          className="resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={2}
                        />
                        <Button 
                          onClick={() => handleAddComment(post.id)}
                          size="sm" 
                          className="mt-2 bg-green-600 hover:bg-green-700"
                          disabled={!newComment.trim()}
                        >
                          إضافة تعليق
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.avatar_url} />
                            <AvatarFallback>{comment.user_name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-semibold text-sm">{comment.user_name}</p>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{formatTime(comment.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
