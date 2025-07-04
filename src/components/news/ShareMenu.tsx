
import React from 'react';
import { Facebook, Twitter, Linkedin, Copy, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

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
  onShare: (post: GardenerPost, platform?: string) => void;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({
  post,
  onShare,
}) => {
  const handleShare = async (platform: string) => {
    const postUrl = `${window.location.origin}/news#post-${post.id}`;
    const shareText = `شاهد هذا المنشور من ${post.gardener.name}: ${post.content.substring(0, 100)}...`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(postUrl);
          toast({
            title: "تم نسخ الرابط",
            description: "تم نسخ رابط المنشور إلى الحافظة",
          });
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = postUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast({
            title: "تم نسخ الرابط",
            description: "تم نسخ رابط المنشور إلى الحافظة",
          });
        }
        break;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-green-500 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>مشاركة</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-2">
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center space-x-3 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-right"
          >
            <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm">فيسبوك</span>
          </button>
          
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center space-x-3 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-right"
          >
            <Twitter className="w-5 h-5 text-sky-500 flex-shrink-0" />
            <span className="text-sm">تويتر</span>
          </button>
          
          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center space-x-3 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-right"
          >
            <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <span className="text-sm">لينكد إن</span>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center space-x-3 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-right"
          >
            <span className="w-5 h-5 text-green-500 flex-shrink-0 text-lg">📱</span>
            <span className="text-sm">واتساب</span>
          </button>
          
          <hr className="my-2" />
          
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center space-x-3 rtl:space-x-reverse w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-right"
          >
            <Copy className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <span className="text-sm">نسخ الرابط</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
