import React, { useState } from 'react';
import BusinessMetricsChart from './BusinessMetricsChart';

// Mock data for market trends
const mockMarketData = {
  industryGrowth: [
    { year: '2018', textiles: 3.2, food: 4.5, beauty: 5.8, tech: 8.2, retail: 2.9 },
    { year: '2019', textiles: 3.5, food: 4.8, beauty: 6.2, tech: 9.5, retail: 3.1 },
    { year: '2020', textiles: 2.8, food: 5.2, beauty: 4.5, tech: 12.8, retail: 1.5 },
    { year: '2021', textiles: 3.9, food: 6.5, beauty: 7.2, tech: 15.5, retail: 4.2 },
    { year: '2022', textiles: 4.5, food: 7.2, beauty: 8.5, tech: 18.2, retail: 5.8 },
    { year: '2023', textiles: 5.2, food: 7.8, beauty: 9.2, tech: 20.5, retail: 6.5 }
  ],
  districtWiseBusinesses: [
    { name: 'Hyderabad', value: 42 },
    { name: 'Rangareddy', value: 18 },
    { name: 'Warangal', value: 12 },
    { name: 'Karimnagar', value: 8 },
    { name: 'Nizamabad', value: 6 },
    { name: 'Others', value: 14 }
  ],
  womenEntrepreneurship: [
    { year: '2018', percentage: 22 },
    { year: '2019', percentage: 24 },
    { year: '2020', percentage: 27 },
    { year: '2021', percentage: 31 },
    { year: '2022', percentage: 35 },
    { year: '2023', percentage: 38 }
  ],
  fundingTrends: [
    { source: 'Bank Loans', value: 45 },
    { source: 'Government Schemes', value: 22 },
    { source: 'Self-Financing', value: 18 },
    { source: 'Angel Investors', value: 8 },
    { source: 'Venture Capital', value: 5 },
    { source: 'Others', value: 2 }
  ],
  consumerPreferences: [
    { category: 'Local Products', value: 68 },
    { category: 'Sustainable Options', value: 72 },
    { category: 'Online Shopping', value: 85 },
    { category: 'Personalized Services', value: 78 },
    { category: 'Traditional Crafts', value: 62 }
  ],
  challengesFaced: [
    { challenge: 'Access to Finance', severity: 8.5 },
    { challenge: 'Market Access', severity: 7.2 },
    { challenge: 'Skilled Workforce', severity: 6.8 },
    { challenge: 'Technology Adoption', severity: 6.5 },
    { challenge: 'Regulatory Compliance', severity: 5.9 },
    { challenge: 'Work-Life Balance', severity: 7.8 }
  ]
};

interface MarketTrendsVisualizationProps {
  data?: any;
  className?: string;
}

const MarketTrendsVisualization: React.FC<MarketTrendsVisualizationProps> = ({
  data = mockMarketData,
  className = ''
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Industry colors
  const industryColors = {
    textiles: '#8884d8',
    food: '#82ca9d',
    beauty: '#ffc658',
    tech: '#0088fe',
    retail: '#ff8042'
  };

  // Get industry growth data based on selection
  const getIndustryGrowthData = () => {
    if (selectedIndustry === 'all') {
      return data.industryGrowth;
    }
    
    // Transform data to only include selected industry
    return data.industryGrowth.map((item: any) => ({
      year: item.year,
      [selectedIndustry]: item[selectedIndustry]
    }));
  };

  // Get industry growth data keys based on selection
  const getIndustryGrowthKeys = () => {
    if (selectedIndustry === 'all') {
      return ['textiles', 'food', 'beauty', 'tech', 'retail'];
    }
    return [selectedIndustry];
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Telangana Market Trends</h2>
        
        <div className="flex space-x-4">
          {/* Industry Filter */}
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="all">All Industries</option>
              <option value="textiles">Textiles & Handicrafts</option>
              <option value="food">Food Processing</option>
              <option value="beauty">Beauty & Wellness</option>
              <option value="tech">Information Technology</option>
              <option value="retail">Retail</option>
            </select>
          </div>
          
          {/* District Filter */}
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">All Districts</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="rangareddy">Rangareddy</option>
              <option value="warangal">Warangal</option>
              <option value="karimnagar">Karimnagar</option>
              <option value="nizamabad">Nizamabad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Insights Header */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Telangana Market Insights</h3>
        <p className="text-sm text-gray-600">
          The Telangana market shows strong growth across multiple sectors, with technology leading at 20.5% annual growth.
          Women entrepreneurship has increased to 38% in 2023, up from 22% in 2018. Hyderabad continues to be the hub for
          business activity, hosting 42% of all businesses in the state.
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Industry Growth Trends */}
        <BusinessMetricsChart
          data={getIndustryGrowthData()}
          type="line"
          title="Industry Growth Trends (%)"
          xAxisKey="year"
          dataKey={getIndustryGrowthKeys()}
          colors={Object.values(industryColors)}
        />
        
        {/* District-wise Business Distribution */}
        <BusinessMetricsChart
          data={data.districtWiseBusinesses}
          type="pie"
          title="District-wise Business Distribution (%)"
          xAxisKey="name"
          dataKey="value"
          colors={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ffc658']}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Women Entrepreneurship Growth */}
        <BusinessMetricsChart
          data={data.womenEntrepreneurship}
          type="line"
          title="Women Entrepreneurship Growth (%)"
          xAxisKey="year"
          dataKey="percentage"
          colors={['#ff6b81']}
        />
        
        {/* Funding Sources */}
        <BusinessMetricsChart
          data={data.fundingTrends}
          type="pie"
          title="Funding Sources for Women Entrepreneurs (%)"
          xAxisKey="source"
          dataKey="value"
          colors={['#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8884d8', '#82ca9d']}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consumer Preferences */}
        <BusinessMetricsChart
          data={data.consumerPreferences}
          type="bar"
          title="Consumer Preferences in Telangana (%)"
          xAxisKey="category"
          dataKey="value"
          colors={['#8884d8']}
        />
        
        {/* Challenges Faced by Women Entrepreneurs */}
        <BusinessMetricsChart
          data={data.challengesFaced}
          type="bar"
          title="Challenges Faced by Women Entrepreneurs (Severity 1-10)"
          xAxisKey="challenge"
          dataKey="severity"
          colors={['#ff6b81']}
        />
      </div>

      {/* Key Insights */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 pl-3">
            <h4 className="font-medium text-gray-800">Growth Opportunities</h4>
            <p className="text-sm text-gray-600">Technology sector shows the highest growth at 20.5%, followed by beauty and wellness at 9.2%.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-3">
            <h4 className="font-medium text-gray-800">Consumer Trends</h4>
            <p className="text-sm text-gray-600">85% of consumers prefer online shopping options, while 72% prioritize sustainable products.</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-3">
            <h4 className="font-medium text-gray-800">Funding Landscape</h4>
            <p className="text-sm text-gray-600">Bank loans (45%) and government schemes (22%) remain the primary funding sources for women entrepreneurs.</p>
          </div>
          <div className="border-l-4 border-red-500 pl-3">
            <h4 className="font-medium text-gray-800">Key Challenges</h4>
            <p className="text-sm text-gray-600">Access to finance (8.5/10) and work-life balance (7.8/10) are the most significant challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsVisualization;
