
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, Calendar } from 'lucide-react';

interface Gardener {
  id: string;
  name: string;
  avatar_url?: string;
  location?: string;
  experience?: string;
  services?: string[];
  rating?: number;
}

interface GardenerHeaderProps {
  gardener: Gardener;
}

export const GardenerHeader: React.FC<GardenerHeaderProps> = ({ gardener }) => {
  return (
    <div className="p-6 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Avatar className="w-12 h-12">
            <AvatarImage src={gardener.avatar_url} />
            <AvatarFallback>
              {gardener.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{gardener.name}</h3>
            <p className="text-gray-600 text-sm">{gardener.location}</p>
            <p className="text-green-600 text-sm">{gardener.experience}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Link to={`/gardeners/${gardener.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 ml-2" />
              عرض الملف الشخصي
            </Button>
          </Link>
          <Link to={`/gardeners/${gardener.id}`}>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 ml-2" />
              احجز الآن
            </Button>
          </Link>
        </div>
      </div>

      {/* Services Tags */}
      {gardener.services && (
        <div className="flex flex-wrap gap-2 mt-4">
          {gardener.services.slice(0, 3).map((service, index) => (
            <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
              {service}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
