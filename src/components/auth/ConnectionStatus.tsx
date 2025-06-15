
import React from 'react';
import { Button } from '../ui/button';
import { Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

interface ConnectionStatusProps {
  isRetrying: boolean;
  setIsRetrying: (retrying: boolean) => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isRetrying, setIsRetrying }) => {
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Test connection to Supabase
      await supabase.auth.getSession();
      toast.success('تم استعادة الاتصال');
      setIsRetrying(false);
    } catch (error) {
      toast.error('لا يزال هناك مشكلة في الاتصال');
      setTimeout(() => setIsRetrying(false), 3000);
    }
  };

  if (!isRetrying) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
      <Wifi className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
      <p className="text-yellow-800 text-sm mb-2">جاري التحقق من الاتصال...</p>
      <Button
        onClick={handleRetry}
        variant="outline"
        size="sm"
        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
      >
        إعادة المحاولة
      </Button>
    </div>
  );
};

export default ConnectionStatus;
