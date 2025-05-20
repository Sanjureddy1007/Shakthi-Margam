import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true
}) => {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Shakti Margam Logo" className="h-12 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Shakti Margam</h1>
                <p className="text-sm text-gray-500">Empowering Women Entrepreneurs in Telangana</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
              <Link to="/assistant" className="text-gray-700 hover:text-primary font-medium">Assistant</Link>
              <Link to="/resources" className="text-gray-700 hover:text-primary font-medium">Resources</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary font-medium">About</Link>
              {user && user.email === 'sanjusandy117@gmail.com' && (
                <Link to="/admin" className="text-gray-700 hover:text-primary font-medium">Admin</Link>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              {isGuest && (
                <div className="bg-primary bg-opacity-10 text-primary px-4 py-1 rounded-full text-sm font-medium">
                  Guest Mode
                </div>
              )}

              {user ? (
                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  className="text-gray-700 hover:text-primary font-medium"
                >
                  Sign Out
                </button>
              ) : isGuest ? (
                <Link
                  to="/login"
                  className="px-5 py-2 bg-white text-primary border border-primary font-medium rounded-lg hover:bg-primary-light transition-colors duration-300"
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  to="/assistant"
                  className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <img src="/logo.png" alt="Shakti Margam Logo" className="h-12 mb-4" />
                <p className="text-gray-400 max-w-md">
                  Shakti Margam empowers women entrepreneurs in Telangana with personalized AI guidance for business growth, social media strategy, financial planning, and more.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business Assessment</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Social Media Strategy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Financial Management</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Market Insights</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>© 2025 Shakti Margam. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
