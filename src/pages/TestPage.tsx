import React from 'react';
import { Link } from 'react-router-dom';
import { cacheBust } from '../utils/cacheBuster';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-light to-white">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={cacheBust('/logo.svg')} alt="Shakti Margam Logo" className="h-10 mr-3" />
            <h1 className="text-2xl font-bold text-primary">Shakti Margam Test Page</h1>
          </div>
          <Link
            to="/"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">UI Component Test</h2>
          <p className="text-gray-700 mb-4">
            This is a test page to verify that our styling and components are working correctly.
            If you can see this page with proper styling, then our basic UI framework is functioning.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-accent1-light p-4 rounded-lg">
              <h3 className="text-accent1 font-semibold mb-2">Accent 1</h3>
              <p>This box should have a light pink background.</p>
            </div>
            <div className="bg-accent2-light p-4 rounded-lg">
              <h3 className="text-accent2 font-semibold mb-2">Accent 2</h3>
              <p>This box should have a light teal background.</p>
            </div>
            <div className="bg-accent3-light p-4 rounded-lg">
              <h3 className="text-accent3 font-semibold mb-2">Accent 3</h3>
              <p>This box should have a light yellow background.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="px-4 py-2 bg-primary text-white rounded-lg">Primary Button</button>
            <button className="px-4 py-2 bg-accent1 text-white rounded-lg">Accent 1 Button</button>
            <button className="px-4 py-2 bg-accent2 text-white rounded-lg">Accent 2 Button</button>
            <button className="px-4 py-2 bg-accent3 text-black rounded-lg">Accent 3 Button</button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Browser Information:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {`User Agent: ${navigator.userAgent}
Screen Width: ${window.innerWidth}px
Screen Height: ${window.innerHeight}px
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}`}
            </pre>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Image Loading Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Logo (SVG):</h3>
              <img src={cacheBust('/logo.svg')} alt="Logo" className="h-20 mb-2" />
              <p className="text-sm text-gray-500">Path: /logo.svg</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Feature Image:</h3>
              <img src={cacheBust('/images/digital_business_interface.svg')} alt="Feature" className="h-20 mb-2" />
              <p className="text-sm text-gray-500">Path: /images/digital_business_interface.svg</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Shakti Margam. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Test page created at: {new Date().toLocaleString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default TestPage;
