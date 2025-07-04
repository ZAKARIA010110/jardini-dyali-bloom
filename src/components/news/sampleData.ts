
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

export const samplePosts: GardenerPost[] = [
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

export const sampleComments: { [postId: string]: Comment[] } = {
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
