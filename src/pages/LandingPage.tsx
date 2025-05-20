import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const LandingPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary-light to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Pochampally Ikat Pattern Background */}
          <div className="absolute inset-0 opacity-10 pattern-pochampally"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <img src={`/logo.svg?v=${Date.now()}`} alt="Shakti Margam Logo" className="h-24 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
                Shakti Margam
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8">
                AI-powered assistant for women entrepreneurs in Telangana
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/assistant"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-lg hover:bg-primary-dark transition-colors duration-300"
                >
                  Start Your Journey
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 bg-white text-primary font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-white transform -skew-y-3 origin-bottom-right"></div>
        </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Empowering Your Business Growth
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-accent2-light rounded-lg p-6 shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <img src={`/images/digital_business_interface.svg?v=${Date.now()}`} alt="Business Assessment" className="h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-accent2 mb-2">Business Assessment</h3>
              <p className="text-gray-600">
                Get a comprehensive analysis of your business with personalized recommendations for growth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-accent1-light rounded-lg p-6 shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <img src={`/images/social_media_strategy.svg?v=${Date.now()}`} alt="Social Media Strategy" className="h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-accent1 mb-2">Social Media Strategy</h3>
              <p className="text-gray-600">
                Develop effective social media strategies using our 4Cs framework tailored for Telangana entrepreneurs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-accent3-light rounded-lg p-6 shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <img src={`/images/financial_dashboard.svg?v=${Date.now()}`} alt="Financial Management" className="h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-accent3 mb-2">Financial Management</h3>
              <p className="text-gray-600">
                Track and optimize your cash flow with tools designed specifically for small businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Telangana Market Insights Section */}
      <section className="py-16 bg-accent4-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src={`/images/telangana_marketplace.svg?v=${Date.now()}`} alt="Telangana Market Insights" className="h-64 mx-auto" />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h2 className="text-3xl font-bold text-accent4 mb-4">
                Telangana Market Insights
              </h2>
              <p className="text-gray-700 mb-6">
                Access specialized market data, funding opportunities, and regulatory information specific to Telangana. Our AI assistant provides culturally relevant guidance incorporating local business practices and traditions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-accent4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Local funding opportunities and government schemes</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-accent4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Industry-specific regulations and compliance guidance</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-accent4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Seasonal business trends and festival-based opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Success Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-primary-light rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img src={`/images/customer_persona.svg?v=${Date.now()}`} alt="Entrepreneur" className="h-16 w-16 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">Priya Reddy</h3>
                  <p className="text-gray-600">Handloom Business, Warangal</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Shakti Margam helped me transform my traditional handloom business with effective social media strategies. My sales have increased by 40% in just three months!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-primary-light rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img src={`/images/customer_persona.svg?v=${Date.now()}`} alt="Entrepreneur" className="h-16 w-16 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">Lakshmi Devi</h3>
                  <p className="text-gray-600">Organic Food Startup, Hyderabad</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The cash flow management tools helped me navigate the challenging early months of my business. The Telangana-specific market insights were invaluable for my organic food startup."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of women entrepreneurs in Telangana who are transforming their businesses with Shakti Margam.
          </p>
          <Link
            to="/assistant"
            className="px-8 py-4 bg-white text-primary font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-300 inline-block"
          >
            Start Now — It's Free
          </Link>
        </div>
      </section>

      </div>
    </MainLayout>
  );
};

export default LandingPage;
