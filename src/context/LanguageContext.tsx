
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'ar' | 'fr' | 'en';
  setLanguage: (lang: 'ar' | 'fr' | 'en') => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.gardeners': 'البستانيون',
    'nav.become.gardener': 'كن بستانياً',
    'nav.login': 'دخول',
    'nav.signup': 'إنشاء حساب',
    'nav.logout': 'خروج',
    'nav.profile': 'الملف الشخصي',
    
    // Hero Section
    'hero.title': 'حديقتك... حلمك... مع جارديني ديالي',
    'hero.subtitle': 'منصة مغربية تربط أصحاب المنازل بأفضل البستانيين المحترفين',
    'hero.cta.homeowner': 'أحتاج بستاني',
    'hero.cta.gardener': 'أريد العمل كبستاني',
    
    // Services
    'services.title': 'خدماتنا المتخصصة',
    'services.design.title': 'تصميم الحدائق',
    'services.design.desc': 'تصميم وتخطيط حدائق عصرية تناسب ذوقك ومساحتك',
    'services.lawn.title': 'العناية بالعشب',
    'services.lawn.desc': 'قص وري وتسميد العشب للحصول على مظهر مثالي',
    'services.planting.title': 'الزراعة والغرس',
    'services.planting.desc': 'زراعة النباتات والأشجار والورود بطريقة احترافية',
    
    // How it works
    'how.title': 'كيف يعمل جارديني ديالي؟',
    'how.homeowner.title': 'لأصحاب المنازل',
    'how.homeowner.step1': 'اطلب الخدمة',
    'how.homeowner.step1.desc': 'حدد نوع الخدمة التي تحتاجها',
    'how.homeowner.step2': 'اختر البستاني',
    'how.homeowner.step2.desc': 'تصفح البستانيين واختر الأنسب',
    'how.homeowner.step3': 'احجز واستمتع',
    'how.homeowner.step3.desc': 'احجز الموعد واستمتع بحديقة أحلامك',
    'how.gardener.title': 'للبستانيين',
    'how.gardener.step1': 'أنشئ ملفك',
    'how.gardener.step1.desc': 'أضف خبراتك وأعمالك السابقة',
    'how.gardener.step2': 'تلقى الطلبات',
    'how.gardener.step2.desc': 'احصل على طلبات من عملاء في منطقتك',
    'how.gardener.step3': 'اعمل واكسب',
    'how.gardener.step3.desc': 'قدم خدماتك واحصل على دخل مستقر',
    
    // Auth
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.login': 'دخول',
    'auth.signup': 'إنشاء حساب',
    'auth.forgot.password': 'نسيت كلمة المرور؟',
    'auth.no.account': 'ليس لديك حساب؟',
    'auth.have.account': 'لديك حساب بالفعل؟',
    'auth.user.type': 'نوع المستخدم',
    'auth.homeowner': 'صاحب منزل',
    'auth.gardener': 'بستاني',
    'auth.name': 'الاسم الكامل',
    'auth.confirm.password': 'تأكيد كلمة المرور',
    
    // Marketplace
    'marketplace.title': 'البستانيون المحترفون',
    'marketplace.subtitle': 'اختر أفضل البستانيين في منطقتك',
    'marketplace.view.profile': 'عرض الملف',
    'marketplace.book.now': 'احجز الآن',
    'marketplace.rating': 'التقييم',
    'marketplace.reviews': 'تقييم',
    'marketplace.hourly.rate': 'درهم/ساعة',
    
    // Footer
    'footer.about': 'حول جارديني ديالي',
    'footer.services': 'خدماتنا',
    'footer.contact': 'اتصل بنا',
    'footer.follow': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Stats
    'stats.gardeners': 'بستاني محترف',
    'stats.clients': 'عميل راضي',
    'stats.projects': 'مشروع مكتمل',
    'stats.cities': 'مدينة مغربية'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.gardeners': 'Jardiniers',
    'nav.become.gardener': 'Devenir Jardinier',
    'nav.login': 'Connexion',
    'nav.signup': 'Inscription',
    'nav.logout': 'Déconnexion',
    'nav.profile': 'Profil',
    
    // Hero Section
    'hero.title': 'Votre jardin... Votre rêve... Avec Jardini Dyali',
    'hero.subtitle': 'Plateforme marocaine connectant propriétaires et jardiniers professionnels',
    'hero.cta.homeowner': "J'ai besoin d'un jardinier",
    'hero.cta.gardener': 'Je veux travailler comme jardinier',
    
    // Services
    'services.title': 'Nos Services Spécialisés',
    'services.design.title': 'Conception de Jardins',
    'services.design.desc': 'Design et planification de jardins modernes adaptés à vos goûts',
    'services.lawn.title': 'Entretien de Pelouse',
    'services.lawn.desc': 'Tonte, arrosage et fertilisation pour un aspect parfait',
    'services.planting.title': 'Plantation et Jardinage',
    'services.planting.desc': 'Plantation professionnelle de plantes, arbres et fleurs',
    
    // How it works
    'how.title': 'Comment fonctionne Jardini Dyali?',
    'how.homeowner.title': 'Pour les Propriétaires',
    'how.homeowner.step1': 'Demandez le service',
    'how.homeowner.step1.desc': 'Spécifiez le type de service dont vous avez besoin',
    'how.homeowner.step2': 'Choisissez le jardinier',
    'how.homeowner.step2.desc': 'Parcourez les jardiniers et choisissez le meilleur',
    'how.homeowner.step3': 'Réservez et profitez',
    'how.homeowner.step3.desc': 'Réservez le rendez-vous et profitez de votre jardin de rêve',
    'how.gardener.title': 'Pour les Jardiniers',
    'how.gardener.step1': 'Créez votre profil',
    'how.gardener.step1.desc': 'Ajoutez votre expérience et vos travaux précédents',
    'how.gardener.step2': 'Recevez des demandes',
    'how.gardener.step2.desc': 'Obtenez des demandes de clients dans votre région',
    'how.gardener.step3': 'Travaillez et gagnez',
    'how.gardener.step3.desc': 'Fournissez vos services et obtenez un revenu stable',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.forgot.password': 'Mot de passe oublié?',
    'auth.no.account': "Vous n'avez pas de compte?",
    'auth.have.account': 'Vous avez déjà un compte?',
    'auth.user.type': "Type d'utilisateur",
    'auth.homeowner': 'Propriétaire',
    'auth.gardener': 'Jardinier',
    'auth.name': 'Nom complet',
    'auth.confirm.password': 'Confirmer le mot de passe',
    
    // Marketplace
    'marketplace.title': 'Jardiniers Professionnels',
    'marketplace.subtitle': 'Choisissez les meilleurs jardiniers de votre région',
    'marketplace.view.profile': 'Voir le profil',
    'marketplace.book.now': 'Réserver maintenant',
    'marketplace.rating': 'Note',
    'marketplace.reviews': 'avis',
    'marketplace.hourly.rate': 'DH/heure',
    
    // Footer
    'footer.about': 'À propos de Jardini Dyali',
    'footer.services': 'Nos Services',
    'footer.contact': 'Contact',
    'footer.follow': 'Suivez-nous',
    'footer.rights': 'Tous droits réservés',
    
    // Stats
    'stats.gardeners': 'Jardiniers professionnels',
    'stats.clients': 'Clients satisfaits',
    'stats.projects': 'Projets terminés',
    'stats.cities': 'Villes marocaines'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.gardeners': 'Gardeners',
    'nav.become.gardener': 'Become a Gardener',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Hero Section
    'hero.title': 'Your Garden... Your Dream... With Jardini Dyali',
    'hero.subtitle': 'Moroccan platform connecting homeowners with professional gardeners',
    'hero.cta.homeowner': 'I need a gardener',
    'hero.cta.gardener': 'I want to work as a gardener',
    
    // Services
    'services.title': 'Our Specialized Services',
    'services.design.title': 'Garden Design',
    'services.design.desc': 'Modern garden design and planning tailored to your taste',
    'services.lawn.title': 'Lawn Care',
    'services.lawn.desc': 'Mowing, watering and fertilizing for perfect appearance',
    'services.planting.title': 'Planting & Gardening',
    'services.planting.desc': 'Professional planting of plants, trees and flowers',
    
    // How it works
    'how.title': 'How does Jardini Dyali work?',
    'how.homeowner.title': 'For Homeowners',
    'how.homeowner.step1': 'Request service',
    'how.homeowner.step1.desc': 'Specify the type of service you need',
    'how.homeowner.step2': 'Choose gardener',
    'how.homeowner.step2.desc': 'Browse gardeners and choose the best fit',
    'how.homeowner.step3': 'Book and enjoy',
    'how.homeowner.step3.desc': 'Book the appointment and enjoy your dream garden',
    'how.gardener.title': 'For Gardeners',
    'how.gardener.step1': 'Create your profile',
    'how.gardener.step1.desc': 'Add your experience and previous work',
    'how.gardener.step2': 'Receive requests',
    'how.gardener.step2.desc': 'Get requests from clients in your area',
    'how.gardener.step3': 'Work and earn',
    'how.gardener.step3.desc': 'Provide your services and get stable income',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.forgot.password': 'Forgot password?',
    'auth.no.account': "Don't have an account?",
    'auth.have.account': 'Already have an account?',
    'auth.user.type': 'User type',
    'auth.homeowner': 'Homeowner',
    'auth.gardener': 'Gardener',
    'auth.name': 'Full name',
    'auth.confirm.password': 'Confirm password',
    
    // Marketplace
    'marketplace.title': 'Professional Gardeners',
    'marketplace.subtitle': 'Choose the best gardeners in your area',
    'marketplace.view.profile': 'View Profile',
    'marketplace.book.now': 'Book Now',
    'marketplace.rating': 'Rating',
    'marketplace.reviews': 'reviews',
    'marketplace.hourly.rate': 'DH/hour',
    
    // Footer
    'footer.about': 'About Jardini Dyali',
    'footer.services': 'Our Services',
    'footer.contact': 'Contact Us',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved',
    
    // Stats
    'stats.gardeners': 'Professional gardeners',
    'stats.clients': 'Happy clients',
    'stats.projects': 'Completed projects',
    'stats.cities': 'Moroccan cities'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'fr' | 'en'>('ar');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
