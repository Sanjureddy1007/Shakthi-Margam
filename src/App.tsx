import React, { useEffect } from 'react';
import { resetScroll } from './utils/scrollUtils';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AIAssistantProvider from './context/AIAssistantProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import StaticLandingPage from './pages/StaticLandingPage';
import SplashPage from './pages/SplashPage';
import AssistantPage from './pages/AssistantPage';
import ResourcesPage from './pages/ResourcesPage';
import AboutPage from './pages/AboutPage';
import _AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import TestPage from './pages/TestPage';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Allow access if user is authenticated or in guest mode
  return (user || isGuest) ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const location = useLocation();

  // Force enable scrolling when routes change
  useEffect(() => {
    // Reset scroll position and ensure scrolling is enabled
    resetScroll();

    // Add a small delay to ensure scrolling is enabled after route change animations
    const timer = setTimeout(() => {
      resetScroll();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <AuthProvider>
      <AIAssistantProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/splash" />} />
            <Route path="/splash" element={<SplashPage />} />

            {/* Apply page transitions to main content pages */}
            <Route path="/home" element={<PageTransition><StaticLandingPage /></PageTransition>} />
            <Route path="/react-landing" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/reset-password/:token" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/assistant" element={<ProtectedRoute element={<PageTransition><AssistantPage /></PageTransition>} />} />
            <Route path="/profile" element={<ProtectedRoute element={<PageTransition><ProfilePage /></PageTransition>} />} />
            <Route path="/admin" element={<ProtectedRoute element={<PageTransition><_AdminDashboardPage /></PageTransition>} />} />
            <Route path="/resources" element={<PageTransition><ResourcesPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/test" element={<PageTransition><TestPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </AIAssistantProvider>
    </AuthProvider>
  );
};

export default App;
