import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement.tsx';
import ContentManagement from '../components/admin/ContentManagement.tsx';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import ResponseModeration from '../components/admin/ResponseModeration.tsx';
import SystemSettings from '../components/admin/SystemSettings.tsx';
import SocialMediaDashboard from '../components/visualizations/SocialMediaDashboard.tsx';
import MarketTrendsVisualization from '../components/visualizations/MarketTrendsVisualization.tsx';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('analytics');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is authorized to access admin dashboard
    const checkAuthorization = async () => {
      try {
        // Check if the user is logged in and has the admin email
        if (user && user.email === 'sanjusandy117@gmail.com') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">You do not have permission to access the admin dashboard.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-2">
            <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'users'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'content'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('content')}
            >
              Content Management
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'moderation'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('moderation')}
            >
              Response Moderation
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'social'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('social')}
            >
              Social Media
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'market'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('market')}
            >
              Market Trends
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              System Settings
            </button>
          </div>
        </div>

        {/* Admin Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'moderation' && <ResponseModeration />}
          {activeTab === 'social' && <SocialMediaDashboard />}
          {activeTab === 'market' && <MarketTrendsVisualization />}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
