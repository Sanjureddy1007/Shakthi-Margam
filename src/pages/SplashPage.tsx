import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SplashPage.css';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // Add splash-page class to html element to enable overflow: hidden only for this page
    document.documentElement.classList.add('splash-page');
    document.body.classList.add('splash-page');

    // Check if user has already seen the splash screen
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      // If user has already seen splash, redirect immediately
      navigate('/home', { replace: true });
      return;
    }

    // Set a timeout to automatically redirect after animation completes (exactly 5 seconds)
    const timer = setTimeout(() => {
      if (!skipped) {
        completeAnimation();
      }
    }, 5000); // Animation duration - 5 seconds

    // Log navigation state for debugging
    console.log('SplashPage mounted, will redirect to /home after timeout');

    // Cleanup function to clear the timeout if component unmounts or skipped changes
    return () => {
      console.log('SplashPage unmounting, clearing timeout');
      clearTimeout(timer);

      // Remove splash-page class when component unmounts
      document.documentElement.classList.remove('splash-page');
      document.body.classList.remove('splash-page');
    };
  }, [skipped, navigate]);

  const completeAnimation = () => {
    setAnimationComplete(true);

    // Set flag in session storage to indicate user has seen splash screen
    sessionStorage.setItem('hasSeenSplash', 'true');

    // Redirect after fade-out animation (1 second transition)
    setTimeout(() => {
      // Navigate to the main platform - using replace to prevent back navigation to splash
      navigate('/home', { replace: true });
      console.log('Redirecting to main platform...');
    }, 1000);
  };

  const handleSkip = () => {
    setSkipped(true);
    completeAnimation();
  };

  return (
    <>
      {/* Full viewport splash container */}
      <div className={`splash-container ${animationComplete ? 'fade-out' : ''}`}>
        <div className="splash-content">
          <div className="logo-container">
            <img
              src="/logo.png"
              alt="Shakti Margam Logo"
              className="shakti-logo"
            />
            <div className="wehub-badge">
              <span>A WE-HUB INITIATIVE</span>
            </div>
          </div>

          <div className="splash-text">
            <h1>Shakti Margam</h1>
            <h2>The Path of Empowerment</h2>
            <p>
              Empowering women entrepreneurs in Telangana with AI-guided business assistance
            </p>
          </div>

          <div className="animation-container">
            <div className="pochampally-pattern"></div>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="skip-button"
          aria-label="Skip animation"
          title="Skip to main platform"
        >
          Skip
        </button>
      </div>
    </>
  );
};

export default SplashPage;
