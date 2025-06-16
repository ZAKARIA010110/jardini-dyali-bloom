
export const getAuthErrorMessage = (error: any): string => {
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return 'مشكلة في الاتصال بالإنترنت. تأكد من اتصالك وحاول مرة أخرى';
  }
  
  if (error.message?.includes('Invalid login credentials')) {
    return 'بيانات الدخول غير صحيحة';
  }
  
  if (error.message?.includes('rate_limit') || error.message?.includes('36 seconds')) {
    return 'يجب انتظار 36 ثانية قبل إعادة المحاولة';
  }
  
  if (error.message?.includes('already registered')) {
    return 'هذا البريد الإلكتروني مسجل مسبقاً';
  }
  
  if (error.message?.includes('invalid email')) {
    return 'بريد إلكتروني غير صحيح';
  }
  
  if (error.message?.includes('password')) {
    return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  }
  
  return error.message || 'حدث خطأ غير متوقع';
};

export const handleAuthError = (error: any, context: string) => {
  console.error(`Auth error in ${context}:`, error);
  return {
    success: false,
    error: getAuthErrorMessage(error)
  };
};

export const getSignupErrorMessage = (error: any): string => {
  const baseMessage = getAuthErrorMessage(error);
  
  if (baseMessage === error.message) {
    if (error.message?.includes('already registered')) {
      return 'هذا البريد الإلكتروني مسجل مسبقاً';
    }
    return 'خطأ في إنشاء الحساب';
  }
  
  return baseMessage;
};
