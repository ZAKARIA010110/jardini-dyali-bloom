
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
    'nav.contact': 'اتصل بنا',
    'nav.faq': 'الأسئلة الشائعة',
    
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
    
    // Signup specific
    'signup.choose.account.type': 'اختر نوع حسابك',
    'signup.choose.description': 'اختر الخيار الذي يناسبك للبدء في رحلتك مع جارديني ديالي',
    'signup.create.account': 'إنشاء حساب',
    'signup.fill.info': 'املأ البيانات التالية لإنشاء حسابك',
    'homeowner.description': 'أبحث عن بستاني محترف للعناية بحديقتي',
    'gardener.description': 'أريد تقديم خدمات البستنة للعملاء',
    'homeowner.feature.1': 'الوصول إلى بستانيين محترفين',
    'homeowner.feature.2': 'مقارنة الأسعار والخدمات',
    'homeowner.feature.3': 'حجز سريع وآمن',
    'homeowner.feature.4': 'تقييم ومراجعة الخدمات',
    'gardener.feature.1': 'الحصول على عملاء جدد',
    'gardener.feature.2': 'إدارة مواعيدك بسهولة',
    'gardener.feature.3': 'عرض أعمالك السابقة',
    'gardener.feature.4': 'زيادة دخلك الشهري',
    'name.placeholder': 'الاسم الكامل',
    'creating.account': 'جاري إنشاء الحساب...',
    'back.to.selection': 'العودة لاختيار نوع الحساب',
    
    // Email verification
    'email.verification.sent': 'تم إرسال رسالة التأكيد!',
    'email.verification.message': 'تم إرسال رسالة تأكيد إلى',
    'email.verification.instructions': 'يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد لإكمال إنشاء حسابك.',
    'resend.email': 'إعادة إرسال رسالة التأكيد',
    'email.resent': 'تم إرسال رسالة التأكيد مرة أخرى',
    'email.resent.wait': 'تم الإرسال - انتظر 30 ثانية',
    'go.to.login': 'الذهاب لصفحة تسجيل الدخول',
    'no.email.received': 'لم تتلق البريد؟',
    'check.spam.folder': 'تحقق من مجلد الرسائل غير المرغوب فيها',
    
    // Validation messages
    'validation.fill.all.fields': 'يرجى ملء جميع الحقول',
    'validation.password.mismatch': 'كلمة المرور غير متطابقة',
    'validation.password.length': 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
    'error.signup': 'خطأ في إنشاء الحساب',
    'error.resend.email': 'خطأ في إرسال البريد',
    
    // Marketplace
    'marketplace.title': 'البستانيون المحترفون',
    'marketplace.subtitle': 'اختر أفضل البستانيين في منطقتك',
    'marketplace.view.profile': 'عرض الملف',
    'marketplace.book.now': 'احجز الآن',
    'marketplace.rating': 'التقييم',
    'marketplace.reviews': 'تقييم',
    'marketplace.hourly.rate': 'درهم/ساعة',
    
    // Contact Page
    'contact.title': 'اتصل بنا',
    'contact.subtitle': 'نحن هنا لمساعدتك. تواصل معنا في أي وقت',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'رقم الهاتف',
    'contact.address': 'العنوان',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال الرسالة',
    'contact.info.title': 'معلومات الاتصال',
    
    // FAQ Page
    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle': 'إجابات على الأسئلة الأكثر شيوعاً حول جارديني ديالي',
    'faq.q1': 'كيف يمكنني التسجيل في جارديني ديالي؟',
    'faq.a1': 'يمكنك التسجيل بسهولة من خلال النقر على زر "إنشاء حساب" واختيار نوع حسابك (صاحب منزل أو بستاني) ثم ملء البيانات المطلوبة.',
    'faq.q2': 'هل الخدمة آمنة ومضمونة؟',
    'faq.a2': 'نعم، جميع البستانيين المسجلين لدينا محترفون ومعتمدون. كما نوفر نظام تقييم وضمان جودة الخدمة.',
    'faq.q3': 'كيف يتم الدفع؟',
    'faq.a3': 'يمكنك الدفع نقداً للبستاني مباشرة أو من خلال التحويل البنكي. نعمل على إضافة المزيد من وسائل الدفع قريباً.',
    
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
    'stats.cities': 'مدينة مغربية',
    
    // Testimonials
    'testimonials.title': 'آراء عملائنا',
    'testimonials.subtitle': 'اكتشف ما يقوله عملاؤنا عن تجربتهم مع جارديني ديالي',
    'testimonials.service.quality': 'خدمة ممتازة',
    'testimonials.professional': 'عمل احترافي',
    'testimonials.price.fair': 'سعر عادل'
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
    'nav.contact': 'Contact',
    'nav.faq': 'FAQ',
    
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
    
    // Signup specific
    'signup.choose.account.type': 'Choisissez votre type de compte',
    'signup.choose.description': 'Choisissez l\'option qui vous convient pour commencer votre voyage avec Jardini Dyali',
    'signup.create.account': 'Créer un compte',
    'signup.fill.info': 'Remplissez les informations suivantes pour créer votre compte',
    'homeowner.description': 'Je cherche un jardinier professionnel pour entretenir mon jardin',
    'gardener.description': 'Je veux offrir des services de jardinage aux clients',
    'homeowner.feature.1': 'Accès aux jardiniers professionnels',
    'homeowner.feature.2': 'Comparer les prix et services',
    'homeowner.feature.3': 'Réservation rapide et sécurisée',
    'homeowner.feature.4': 'Évaluer et commenter les services',
    'gardener.feature.1': 'Obtenir de nouveaux clients',
    'gardener.feature.2': 'Gérer vos rendez-vous facilement',
    'gardener.feature.3': 'Présenter vos travaux précédents',
    'gardener.feature.4': 'Augmenter votre revenu mensuel',
    'name.placeholder': 'Nom complet',
    'creating.account': 'Création du compte...',
    'back.to.selection': 'Retour à la sélection du type de compte',
    
    // Email verification
    'email.verification.sent': 'Email de confirmation envoyé!',
    'email.verification.message': 'Un email de confirmation a été envoyé à',
    'email.verification.instructions': 'Veuillez ouvrir votre email et cliquer sur le lien de confirmation pour terminer la création de votre compte.',
    'resend.email': 'Renvoyer l\'email de confirmation',
    'email.resent': 'Email de confirmation renvoyé',
    'email.resent.wait': 'Envoyé - attendez 30 secondes',
    'go.to.login': 'Aller à la page de connexion',
    'no.email.received': 'Pas d\'email reçu?',
    'check.spam.folder': 'Vérifiez votre dossier spam',
    
    // Validation messages
    'validation.fill.all.fields': 'Veuillez remplir tous les champs',
    'validation.password.mismatch': 'Les mots de passe ne correspondent pas',
    'validation.password.length': 'Le mot de passe doit contenir au moins 6 caractères',
    'error.signup': 'Erreur lors de la création du compte',
    'error.resend.email': 'Erreur lors de l\'envoi de l\'email',
    
    // Marketplace
    'marketplace.title': 'Jardiniers Professionnels',
    'marketplace.subtitle': 'Choisissez les meilleurs jardiniers de votre région',
    'marketplace.view.profile': 'Voir le profil',
    'marketplace.book.now': 'Réserver maintenant',
    'marketplace.rating': 'Note',
    'marketplace.reviews': 'avis',
    'marketplace.hourly.rate': 'DH/heure',
    
    // Contact Page
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Nous sommes là pour vous aider. Contactez-nous à tout moment',
    'contact.name': 'Nom complet',
    'contact.email': 'Email',
    'contact.phone': 'Téléphone',
    'contact.address': 'Adresse',
    'contact.message': 'Votre message',
    'contact.send': 'Envoyer le message',
    'contact.info.title': 'Informations de contact',
    
    // FAQ Page
    'faq.title': 'Questions Fréquemment Posées',
    'faq.subtitle': 'Réponses aux questions les plus courantes sur Jardini Dyali',
    'faq.q1': 'Comment puis-je m\'inscrire sur Jardini Dyali?',
    'faq.a1': 'Vous pouvez vous inscrire facilement en cliquant sur le bouton "Inscription" et en choisissant votre type de compte (propriétaire ou jardinier) puis en remplissant les informations requises.',
    'faq.q2': 'Le service est-il sûr et garanti?',
    'faq.a2': 'Oui, tous les jardiniers enregistrés chez nous sont professionnels et certifiés. Nous fournissons également un système d\'évaluation et une garantie de qualité de service.',
    'faq.q3': 'Comment se fait le paiement?',
    'faq.a3': 'Vous pouvez payer en espèces directement au jardinier ou par virement bancaire. Nous travaillons à ajouter plus de moyens de paiement prochainement.',
    
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
    'stats.cities': 'Villes marocaines',
    
    // Testimonials
    'testimonials.title': 'Avis de nos clients',
    'testimonials.subtitle': 'Découvrez ce que nos clients disent de leur expérience avec Jardini Dyali',
    'testimonials.service.quality': 'Service excellent',
    'testimonials.professional': 'Travail professionnel',
    'testimonials.price.fair': 'Prix équitable'
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
    'nav.contact': 'Contact',
    'nav.faq': 'FAQ',
    
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
    
    // Signup specific
    'signup.choose.account.type': 'Choose your account type',
    'signup.choose.description': 'Choose the option that suits you to start your journey with Jardini Dyali',
    'signup.create.account': 'Create account',
    'signup.fill.info': 'Fill in the following information to create your account',
    'homeowner.description': 'I\'m looking for a professional gardener to take care of my garden',
    'gardener.description': 'I want to provide gardening services to clients',
    'homeowner.feature.1': 'Access to professional gardeners',
    'homeowner.feature.2': 'Compare prices and services',
    'homeowner.feature.3': 'Quick and secure booking',
    'homeowner.feature.4': 'Rate and review services',
    'gardener.feature.1': 'Get new clients',
    'gardener.feature.2': 'Manage your appointments easily',
    'gardener.feature.3': 'Showcase your previous work',
    'gardener.feature.4': 'Increase your monthly income',
    'name.placeholder': 'Full name',
    'creating.account': 'Creating account...',
    'back.to.selection': 'Back to account type selection',
    
    // Email verification
    'email.verification.sent': 'Verification email sent!',
    'email.verification.message': 'A verification email has been sent to',
    'email.verification.instructions': 'Please open your email and click on the verification link to complete creating your account.',
    'resend.email': 'Resend verification email',
    'email.resent': 'Verification email resent',
    'email.resent.wait': 'Sent - wait 30 seconds',
    'go.to.login': 'Go to login page',
    'no.email.received': 'No email received?',
    'check.spam.folder': 'Check your spam folder',
    
    // Validation messages
    'validation.fill.all.fields': 'Please fill all fields',
    'validation.password.mismatch': 'Passwords do not match',
    'validation.password.length': 'Password must be at least 6 characters',
    'error.signup': 'Error creating account',
    'error.resend.email': 'Error sending email',
    
    // Marketplace
    'marketplace.title': 'Professional Gardeners',
    'marketplace.subtitle': 'Choose the best gardeners in your area',
    'marketplace.view.profile': 'View Profile',
    'marketplace.book.now': 'Book Now',
    'marketplace.rating': 'Rating',
    'marketplace.reviews': 'reviews',
    'marketplace.hourly.rate': 'DH/hour',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to help you. Contact us anytime',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.info.title': 'Contact Information',
    
    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to the most common questions about Jardini Dyali',
    'faq.q1': 'How can I register on Jardini Dyali?',
    'faq.a1': 'You can easily register by clicking the "Sign Up" button and choosing your account type (homeowner or gardener) then filling in the required information.',
    'faq.q2': 'Is the service safe and guaranteed?',
    'faq.a2': 'Yes, all gardeners registered with us are professional and certified. We also provide a rating system and service quality guarantee.',
    'faq.q3': 'How is payment made?',
    'faq.a3': 'You can pay cash directly to the gardener or by bank transfer. We are working to add more payment methods soon.',
    
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
