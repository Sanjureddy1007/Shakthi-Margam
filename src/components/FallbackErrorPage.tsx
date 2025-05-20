import React from 'react';

const FallbackErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Shakti Margam</h1>
          <div className="mb-6 flex justify-center">
            <svg width="100" height="100" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-auto">
              <path d="M20 10L10 20L20 30L30 20L20 10Z" fill="#6A2C70"/>
              <path d="M40 10L30 20L40 30L50 20L40 10Z" fill="#E84A5F"/>
              <path d="M30 20L20 30L30 40L40 30L30 20Z" fill="#2A9D8F"/>
              <path d="M50 20L40 30L50 40L60 30L50 20Z" fill="#F9C74F"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Application Loading Issue</h2>
          <p className="text-gray-600 mb-6">
            We're experiencing some technical difficulties loading the application. This might be due to missing environment variables or API configuration.
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Steps:</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Check if your .env file is properly configured</li>
                <li>Ensure all required API keys are set</li>
                <li>Try refreshing the page</li>
                <li>Clear your browser cache</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary-dark transition-colors duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2023 Shakti Margam. All rights reserved.</p>
        <p className="mt-1">AI-powered assistant for women entrepreneurs in Telangana</p>
      </div>
    </div>
  );
};

export default FallbackErrorPage;
