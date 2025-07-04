
import React from 'react';
import { Facebook, Twitter, Linkedin, Copy } from 'lucide-react';

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

interface ShareMenuProps {
  post: GardenerPost;
  showShareMenu: boolean;
  onShare: (post: GardenerPost, platform?: string) => void;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({
  post,
  showShareMenu,
  onShare,
}) => {
  if (!showShareMenu) return null;

  return (
    <div className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-48">
      <button
        onClick={() => onShare(post, 'facebook')}
        className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
      >
        <Facebook className="w-4 h-4 text-blue-600" />
        <span>فيسبوك</span>
      </button>
      <button
        onClick={() => onShare(post, 'twitter')}
        className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
      >
        <Twitter className="w-4 h-4 text-sky-500" />
        <span>تويتر</span>
      </button>
      <button
        onClick={() => onShare(post, 'linkedin')}
        className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
      >
        <Linkedin className="w-4 h-4 text-blue-700" />
        <span>لينكد إن</span>
      </button>
      <button
        onClick={() => onShare(post, 'whatsapp')}
        className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
      >
        <span className="w-4 h-4 text-green-500">📱</span>
        <span>واتساب</span>
      </button>
      <button
        onClick={() => onShare(post, 'copy')}
        className="flex items-center space-x-2 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded"
      >
        <Copy className="w-4 h-4 text-gray-600" />
        <span>نسخ الرابط</span>
      </button>
    </div>
  );
};
