
import React from 'react';
import { useAuth } from '@/context/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_name: string;
  avatar_url?: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  newComment: string;
  onAddComment: (postId: string) => void;
  onCommentChange: (value: string) => void;
  formatTime: (dateString: string) => string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  newComment,
  onAddComment,
  onCommentChange,
  formatTime,
}) => {
  const { user } = useAuth();

  return (
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
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="اكتب تعليقاً..."
            className="resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={2}
          />
          <Button 
            onClick={() => onAddComment(postId)}
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
        {comments.map((comment) => (
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
  );
};
