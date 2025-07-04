
import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

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

interface PostInteractionsProps {
  post: GardenerPost;
  comments: Comment[];
  showShareMenu: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (post: GardenerPost, platform?: string) => void;
}

export const PostInteractions: React.FC<PostInteractionsProps> = ({
  post,
  comments,
  showShareMenu,
  onLike,
  onComment,
  onShare,
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-6 rtl:space-x-reverse">
        <button
          onClick={() => onLike(post.id)}
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
          onClick={() => onComment(post.id)}
          className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length || post.comments_count}</span>
        </button>

        <button
          onClick={() => onShare(post)}
          className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-green-500 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>مشاركة</span>
        </button>
      </div>
    </div>
  );
};
