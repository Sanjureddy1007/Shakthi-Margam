import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SplashRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user has already seen the splash screen
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    // Only redirect to splash page if:
    // 1. We're not already on the splash page
    // 2. We're not on the home page (to prevent redirection loops)
    // 3. User hasn't seen the splash screen in this session
    if (location.pathname !== '/splash' &&
        location.pathname !== '/home' &&
        !hasSeenSplash) {

      console.log('SplashRedirect: Redirecting to splash page from', location.pathname);
      // Use replace to prevent back navigation issues
      navigate('/splash', { replace: true });
    } else {
      console.log('SplashRedirect: No redirection needed from', location.pathname);
    }
  }, [navigate, location]);

  // This component doesn't render anything
  return null;
};

export default SplashRedirect;
