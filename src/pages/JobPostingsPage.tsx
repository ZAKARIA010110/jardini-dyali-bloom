import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { FileText, ArrowRight, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JobPostingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                نشر طلبات العمل
              </h1>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                هذه الميزة قيد التطوير وستكون متاحة قريبًا. ستتمكن من نشر طلبات عمل والحصول على عروض من البستانيين.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/gardeners')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  احجز بستاني مباشرة
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  لوحة التحكم
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobPostingsPage;
