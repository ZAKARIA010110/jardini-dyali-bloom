
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { GardenerHeader } from './GardenerHeader';
import { PostInteractions } from './PostInteractions';
import { CommentSection } from './CommentSection';
import { ShareMenu } from './ShareMenu';

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

interface PostCardProps {
  post: GardenerPost;
  comments: Comment[];
  showComments: boolean;
  showShareMenu: boolean;
  newComment: string;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (post: GardenerPost, platform?: string) => void;
  onAddComment: (postId: string) => void;
  onCommentChange: (value: string) => void;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  comments,
  showComments,
  showShareMenu,
  newComment,
  onLike,
  onComment,
  onShare,
  onAddComment,
  onCommentChange,
  formatDate,
  formatTime,
}) => {
  return (
    <Card id={`post-${post.id}`} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-0">
        <GardenerHeader gardener={post.gardener} />

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

          <PostInteractions
            post={post}
            comments={comments}
            showShareMenu={showShareMenu}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
          />

          <ShareMenu
            post={post}
            showShareMenu={showShareMenu}
            onShare={onShare}
          />

          {showComments && (
            <CommentSection
              postId={post.id}
              comments={comments}
              newComment={newComment}
              onAddComment={onAddComment}
              onCommentChange={onCommentChange}
              formatTime={formatTime}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
