import React, { useState } from 'react';

interface SocialMediaMetricsDashboardProps {
  className?: string;
}

interface PlatformMetrics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  clicks: number;
  conversions: number;
}

const SocialMediaMetricsDashboard: React.FC<SocialMediaMetricsDashboardProps> = ({ className }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [metrics, setMetrics] = useState<PlatformMetrics[]>([
    {
      platform: 'Instagram',
      followers: 1250,
      engagement: 3.8,
      reach: 4500,
      clicks: 120,
      conversions: 15,
    },
    {
      platform: 'Facebook',
      followers: 850,
      engagement: 2.1,
      reach: 3200,
      clicks: 85,
      conversions: 8,
    },
    {
      platform: 'LinkedIn',
      followers: 420,
      engagement: 4.2,
      reach: 1800,
      clicks: 95,
      conversions: 12,
    }
  ]);

  // Calculate total metrics
  const totalFollowers = metrics.reduce((sum, platform) => sum + platform.followers, 0);
  const avgEngagement = metrics.reduce((sum, platform) => sum + platform.engagement, 0) / metrics.length;
  const totalReach = metrics.reduce((sum, platform) => sum + platform.reach, 0);
  const totalClicks = metrics.reduce((sum, platform) => sum + platform.clicks, 0);
  const totalConversions = metrics.reduce((sum, platform) => sum + platform.conversions, 0);
  
  // Calculate conversion rate
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  // Get platform color
  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'linkedin':
        return 'bg-blue-700';
      case 'youtube':
        return 'bg-red-600';
      case 'twitter':
        return 'bg-blue-400';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Social Media Metrics Dashboard</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === 'week'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === 'month'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('quarter')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === 'quarter'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quarter
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Followers</h3>
            <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Avg. Engagement</h3>
            <p className="text-2xl font-bold text-gray-900">{avgEngagement.toFixed(1)}%</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
            <p className="text-2xl font-bold text-gray-900">{totalReach.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
            <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
          </div>
        </div>
        
        {/* Platform Metrics */}
        <h3 className="text-md font-medium text-gray-900 mb-3">Platform Performance</h3>
        
        <div className="space-y-4">
          {metrics.map((platform) => (
            <div key={platform.platform} className="border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getPlatformColor(platform.platform)}`}>
                  {platform.platform.charAt(0)}
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">{platform.platform}</h4>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="text-lg font-semibold text-gray-900">{platform.followers.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Engagement Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{platform.engagement.toFixed(1)}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Reach</p>
                  <p className="text-lg font-semibold text-gray-900">{platform.reach.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Clicks</p>
                  <p className="text-lg font-semibold text-gray-900">{platform.clicks.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Conversion Funnel</p>
                <div className="mt-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(platform.conversions / platform.clicks) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Clicks: {platform.clicks}</span>
                  <span>Conversions: {platform.conversions} ({((platform.conversions / platform.clicks) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaMetricsDashboard;
