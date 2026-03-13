import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import Category from '../pages/Category.jsx'
import InternationalNewsPage from '../pages/InternationalNewsPage.jsx'
import BusinessNewsPage from '../pages/BusinessNewsPage.jsx'
import RegionalNewsPage from '../pages/RegionalNewsPage.jsx'
import ArticleDetailsPage from '../pages/ArticleDetailsPage.jsx'
import EventDetailsPage from '../pages/EventDetailsPage.jsx'
import OpportunityDetailsPage from '../pages/OpportunityDetailsPage.jsx'
import Opportunities from '../pages/Opportunities.jsx'
import Events from '../pages/Events.jsx'
import AboutUs from '../pages/AboutUs.jsx'
import SubmitStory from '../pages/SubmitStory.jsx'
import PrivacyPolicy from '../pages/PrivacyPolicy.jsx'
import TermsOfService from '../pages/TermsOfService.jsx'
import NotFound from '../pages/NotFound.jsx'
import NetworkError from '../pages/NetworkError.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import { useNetworkStatus } from '../hooks/useNetworkStatus.js'
import { usePageTracking } from '../hooks/useAnalytics.js'

// Admin imports
import AdminLogin from '../admin/pages/AdminLogin.jsx'
import AdminRegister from '../admin/pages/AdminRegister.jsx'
import ForgotPassword from '../admin/pages/ForgotPassword.jsx'
import AdminLayout from '../admin/layouts/AdminLayout.jsx'
import AdminDashboard from '../admin/pages/AdminDashboard.jsx'
import AdminArticles from '../admin/pages/AdminArticles.jsx'
import AdminSubmissions from '../admin/pages/AdminSubmissions.jsx'
import AdminEvents from '../admin/pages/AdminEvents.jsx'
import AdminOpportunities from '../admin/pages/AdminOpportunities.jsx'
import AdminUsers from '../admin/pages/AdminUsers.jsx'
import AdminProfile from '../admin/pages/AdminProfile.jsx'
import AdminNotifications from '../admin/pages/AdminNotifications.jsx'
import AdminSettings from '../admin/pages/AdminSettings.jsx'
import ProtectedRoute from '../admin/components/ProtectedRoute.jsx'
import RoleProtectedRoute from '../admin/components/RoleProtectedRoute.jsx'

export default function App() {
  const isOnline = useNetworkStatus();
  
  // Track page views automatically
  usePageTracking();

  if (!isOnline) {
    return <NetworkError />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="international-news" element={<InternationalNewsPage />} />
          <Route path="business-news" element={<BusinessNewsPage />} />
          <Route path="regional-news" element={<RegionalNewsPage />} />
          <Route path="article/:id" element={<ArticleDetailsPage />} />
          <Route path="event/:id" element={<EventDetailsPage />} />
          <Route path="opportunity/:id" element={<OpportunityDetailsPage />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="events" element={<Events />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="submit-story" element={<SubmitStory />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/register" element={<AdminRegister />} />
        <Route path="admin/forgot-password" element={<ForgotPassword />} />
        <Route path="admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
          <Route path="users" element={
            <RoleProtectedRoute allowedRoles={['admin', 'editor']}>
              <AdminUsers />
            </RoleProtectedRoute>
          } />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
