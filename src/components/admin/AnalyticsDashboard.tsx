import React, { useState } from 'react';

// Mock data for analytics
const mockAnalyticsData = {
  userMetrics: {
    totalUsers: 1245,
    activeUsers: 876,
    newUsersThisMonth: 124,
    userGrowthRate: 8.2
  },
  aiMetrics: {
    totalConversations: 5432,
    averageResponseTime: 1.2,
    responseQualityScore: 4.3,
    cacheHitRate: 68
  },
  moduleUsage: [
    { name: 'Initial Assessment', count: 1245, percentage: 28 },
    { name: 'Social Media Strategy', count: 1876, percentage: 42 },
    { name: 'Financial Analysis', count: 567, percentage: 13 },
    { name: 'Telangana Market Insights', count: 432, percentage: 10 },
    { name: 'Customer Profiling', count: 312, percentage: 7 }
  ],
  userSatisfaction: {
    excellent: 42,
    good: 38,
    average: 15,
    poor: 5
  },
  dailyActiveUsers: [
    { date: '2023-06-01', count: 345 },
    { date: '2023-06-02', count: 356 },
    { date: '2023-06-03', count: 378 },
    { date: '2023-06-04', count: 402 },
    { date: '2023-06-05', count: 389 },
    { date: '2023-06-06', count: 412 },
    { date: '2023-06-07', count: 423 }
  ]
};

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('week');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'day' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeRange('day')}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'year' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{mockAnalyticsData.userMetrics.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-md">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-500 font-medium">↑ {mockAnalyticsData.userMetrics.userGrowthRate}%</span>
            <span className="text-xs text-gray-500 ml-1">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{mockAnalyticsData.userMetrics.activeUsers}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-md">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-500 font-medium">↑ 5.3%</span>
            <span className="text-xs text-gray-500 ml-1">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Conversations</p>
              <h3 className="text-2xl font-bold text-gray-800">{mockAnalyticsData.aiMetrics.totalConversations}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-md">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-500 font-medium">↑ 12.7%</span>
            <span className="text-xs text-gray-500 ml-1">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Response Quality</p>
              <h3 className="text-2xl font-bold text-gray-800">{mockAnalyticsData.aiMetrics.responseQualityScore}/5</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-md">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-500 font-medium">↑ 0.2</span>
            <span className="text-xs text-gray-500 ml-1">vs last {timeRange}</span>
          </div>
        </div>
      </div>

      {/* Module Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Module Usage</h3>
          <div className="space-y-4">
            {mockAnalyticsData.moduleUsage.map((module) => (
              <div key={module.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{module.name}</span>
                  <span className="text-sm text-gray-500">{module.count} sessions ({module.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${module.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Satisfaction</h3>
          <div className="flex items-center justify-center h-64">
            <div className="grid grid-cols-4 gap-4 w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-full bg-green-100 rounded-t-lg p-2 text-center">
                  <span className="text-green-800 text-xs font-medium">{mockAnalyticsData.userSatisfaction.excellent}%</span>
                </div>
                <div className="bg-green-500 h-32 w-full rounded-b-lg" style={{ height: `${mockAnalyticsData.userSatisfaction.excellent * 2}px` }}></div>
                <span className="text-xs text-gray-500 mt-2">Excellent</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t-lg p-2 text-center">
                  <span className="text-blue-800 text-xs font-medium">{mockAnalyticsData.userSatisfaction.good}%</span>
                </div>
                <div className="bg-blue-500 h-32 w-full rounded-b-lg" style={{ height: `${mockAnalyticsData.userSatisfaction.good * 2}px` }}></div>
                <span className="text-xs text-gray-500 mt-2">Good</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full bg-yellow-100 rounded-t-lg p-2 text-center">
                  <span className="text-yellow-800 text-xs font-medium">{mockAnalyticsData.userSatisfaction.average}%</span>
                </div>
                <div className="bg-yellow-500 h-32 w-full rounded-b-lg" style={{ height: `${mockAnalyticsData.userSatisfaction.average * 2}px` }}></div>
                <span className="text-xs text-gray-500 mt-2">Average</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full bg-red-100 rounded-t-lg p-2 text-center">
                  <span className="text-red-800 text-xs font-medium">{mockAnalyticsData.userSatisfaction.poor}%</span>
                </div>
                <div className="bg-red-500 h-32 w-full rounded-b-lg" style={{ height: `${mockAnalyticsData.userSatisfaction.poor * 2}px` }}></div>
                <span className="text-xs text-gray-500 mt-2">Poor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Response Time</span>
              <span className="text-sm font-medium text-gray-700">{mockAnalyticsData.aiMetrics.averageResponseTime}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${(mockAnalyticsData.aiMetrics.averageResponseTime / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Average time to generate a response</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Cache Hit Rate</span>
              <span className="text-sm font-medium text-gray-700">{mockAnalyticsData.aiMetrics.cacheHitRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${mockAnalyticsData.aiMetrics.cacheHitRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Percentage of responses served from cache</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">API Usage</span>
              <span className="text-sm font-medium text-gray-700">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-500 h-2.5 rounded-full" 
                style={{ width: '72%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Percentage of monthly API quota used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
