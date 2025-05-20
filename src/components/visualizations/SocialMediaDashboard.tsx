import React, { useState } from 'react';
import BusinessMetricsChart from './BusinessMetricsChart';

// Mock data for social media metrics
const mockSocialData = {
  overview: {
    followers: 2450,
    engagement: 3.8,
    reach: 12500,
    impressions: 28700
  },
  platforms: [
    { name: 'Instagram', followers: 1200, engagement: 4.2, posts: 45 },
    { name: 'Facebook', followers: 850, engagement: 2.8, posts: 38 },
    { name: 'LinkedIn', followers: 320, engagement: 5.1, posts: 22 },
    { name: 'Twitter', followers: 80, engagement: 1.9, posts: 15 }
  ],
  engagement: [
    { month: 'Jan', instagram: 3.2, facebook: 2.1, linkedin: 4.5, twitter: 1.2 },
    { month: 'Feb', instagram: 3.5, facebook: 2.3, linkedin: 4.7, twitter: 1.5 },
    { month: 'Mar', instagram: 3.8, facebook: 2.5, linkedin: 4.9, twitter: 1.7 },
    { month: 'Apr', instagram: 4.0, facebook: 2.7, linkedin: 5.0, twitter: 1.8 },
    { month: 'May', instagram: 4.2, facebook: 2.8, linkedin: 5.1, twitter: 1.9 },
    { month: 'Jun', instagram: 4.5, facebook: 3.0, linkedin: 5.3, twitter: 2.0 }
  ],
  contentPerformance: [
    { type: 'Photos', engagement: 4.5, reach: 1200 },
    { type: 'Videos', engagement: 5.8, reach: 1800 },
    { type: 'Carousels', engagement: 6.2, reach: 1500 },
    { type: 'Stories', engagement: 3.2, reach: 950 },
    { type: 'Reels', engagement: 7.5, reach: 2200 }
  ],
  audienceDemographics: [
    { name: 'Women 18-24', value: 22 },
    { name: 'Women 25-34', value: 38 },
    { name: 'Women 35-44', value: 18 },
    { name: 'Women 45+', value: 12 },
    { name: 'Men', value: 10 }
  ],
  postTimings: [
    { time: '6-9 AM', engagement: 2.1 },
    { time: '9-12 PM', engagement: 3.5 },
    { time: '12-3 PM', engagement: 4.2 },
    { time: '3-6 PM', engagement: 5.1 },
    { time: '6-9 PM', engagement: 6.3 },
    { time: '9-12 AM', engagement: 3.8 }
  ]
};

interface SocialMediaDashboardProps {
  data?: any;
  className?: string;
}

const SocialMediaDashboard: React.FC<SocialMediaDashboardProps> = ({
  data = mockSocialData,
  className = ''
}) => {
  const [timeRange, setTimeRange] = useState<string>('6m');
  const [activePlatform, setActivePlatform] = useState<string>('all');

  // Platform colors for consistent styling
  const platformColors = {
    instagram: '#E1306C',
    facebook: '#4267B2',
    linkedin: '#0077B5',
    twitter: '#1DA1F2',
    all: '#8884d8'
  };

  // Get color array for charts
  const getColorArray = () => {
    if (activePlatform === 'all') {
      return Object.values(platformColors);
    }
    return [platformColors[activePlatform as keyof typeof platformColors]];
  };

  // Filter data based on active platform
  const getFilteredData = (dataSet: any[]) => {
    if (activePlatform === 'all') return dataSet;
    return dataSet.filter(item => 
      item.name?.toLowerCase() === activePlatform || 
      item.platform?.toLowerCase() === activePlatform
    );
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Social Media Performance</h2>
        
        <div className="flex space-x-4">
          {/* Platform Filter */}
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={activePlatform}
              onChange={(e) => setActivePlatform(e.target.value)}
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
          
          {/* Time Range Filter */}
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Followers</p>
          <h3 className="text-2xl font-bold text-gray-800">{formatNumber(data.overview.followers)}</h3>
          <span className="text-xs text-green-500">↑ 12.4%</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Avg. Engagement Rate</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.overview.engagement}%</h3>
          <span className="text-xs text-green-500">↑ 0.6%</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Reach</p>
          <h3 className="text-2xl font-bold text-gray-800">{formatNumber(data.overview.reach)}</h3>
          <span className="text-xs text-green-500">↑ 18.2%</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Impressions</p>
          <h3 className="text-2xl font-bold text-gray-800">{formatNumber(data.overview.impressions)}</h3>
          <span className="text-xs text-green-500">↑ 15.7%</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Engagement Rate by Platform */}
        <BusinessMetricsChart
          data={data.engagement}
          type="line"
          title="Engagement Rate by Platform"
          xAxisKey="month"
          dataKey={['instagram', 'facebook', 'linkedin', 'twitter']}
          colors={[
            platformColors.instagram,
            platformColors.facebook,
            platformColors.linkedin,
            platformColors.twitter
          ]}
        />
        
        {/* Content Performance */}
        <BusinessMetricsChart
          data={data.contentPerformance}
          type="bar"
          title="Content Performance by Type"
          xAxisKey="type"
          dataKey="engagement"
          colors={getColorArray()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audience Demographics */}
        <BusinessMetricsChart
          data={data.audienceDemographics}
          type="pie"
          title="Audience Demographics"
          xAxisKey="name"
          dataKey="value"
          colors={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c']}
        />
        
        {/* Best Posting Times */}
        <BusinessMetricsChart
          data={data.postTimings}
          type="bar"
          title="Engagement by Posting Time"
          xAxisKey="time"
          dataKey="engagement"
          colors={getColorArray()}
        />
      </div>

      {/* Platform Comparison Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Followers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.platforms.map((platform: any) => (
                <tr key={platform.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                          style={{ 
                            backgroundColor: platformColors[platform.name.toLowerCase() as keyof typeof platformColors] 
                          }}
                        >
                          {platform.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(platform.followers)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {platform.engagement}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {platform.posts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaDashboard;
