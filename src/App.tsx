
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import AuthProvider from './context/AuthProvider';
import EmailVerificationHandler from './components/auth/EmailVerificationHandler';
import { Toaster } from './components/ui/sonner';

// Pages
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import UserDashboard from './pages/UserDashboard';
import GardenerListingPage from './pages/GardenerListingPage';
import GardenerProfilePage from './pages/GardenerProfilePage';
import BecomeGardenerPage from './pages/BecomeGardenerPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import GardenAnalysisPage from './pages/GardenAnalysisPage';
import JobPostingsPage from './pages/JobPostingsPage';
import GardenerJobsPage from './pages/GardenerJobsPage';
import GardenerNewsPage from './pages/GardenerNewsPage';
import RequestGardenerPage from './pages/RequestGardenerPage';
import PostJobPage from './pages/PostJobPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <EmailVerificationHandler />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/email-verification" element={<EmailVerificationPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/gardeners" element={<GardenerListingPage />} />
              <Route path="/gardeners/:id" element={<GardenerProfilePage />} />
              <Route path="/become-gardener" element={<BecomeGardenerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/garden-analysis" element={<GardenAnalysisPage />} />
              <Route path="/job-postings" element={<JobPostingsPage />} />
              <Route path="/gardener-jobs" element={<GardenerJobsPage />} />
              <Route path="/news" element={<GardenerNewsPage />} />
              <Route path="/request-gardener" element={<RequestGardenerPage />} />
              <Route path="/post-job" element={<PostJobPage />} />
              <Route path="/gardener-listing" element={<GardenerListingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
