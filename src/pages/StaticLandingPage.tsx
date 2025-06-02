import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pochampally-patterns.css';
import SplashRedirect from '../components/SplashRedirect';
import AnimatedButton from '../components/AnimatedButton';
import { enableScrolling, resetScroll, applyScrollingFix } from '../utils/scrollUtils';

const StaticLandingPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    resetScroll();
    applyScrollingFix(pageRef.current);

    const timer = setTimeout(() => {
      enableScrolling();
      applyScrollingFix(pageRef.current);
    }, 100);

    const handleUserInteraction = () => {
      enableScrolling();
      applyScrollingFix(pageRef.current);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      enableScrolling();
    };
  }, []);

  useEffect(() => {
    window.redirectToAssistant = () => {
      window.location.href = '/assistant';
    };

    window.redirectToAssistantWithModule = (moduleId: string) => {
      localStorage.setItem('shaktiMargamActiveModule', moduleId);
      window.location.href = '/assistant';
    };

    window.handleFormSubmit = (event: any, formType: string) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const data: any = {};

      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      data.formType = formType;

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="inline-block animate-spin mr-2">↻</span> Submitting...';
        submitButton.disabled = true;

        setTimeout(() => {
          console.log('Form submitted:', data);
          window.showSuccessMessage(form);
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }, 1000);
      }
      return false;
    };

    window.showSuccessMessage = (form: HTMLFormElement) => {
      const successMessage = document.createElement('div');
      successMessage.className = 'mt-4 p-3 bg-green-100 text-green-800 rounded-lg';
      successMessage.textContent = 'Thank you! Your submission has been received.';
      form.appendChild(successMessage);
      form.reset();
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    };

    window.sendDemoMessage = () => {
      const inputElement = document.getElementById('demo-chat-input') as HTMLInputElement;
      if (!inputElement) return;
      const message = inputElement.value.trim();
      if (!message) return;

      const chatContainer = inputElement.closest('.p-4')?.querySelector('div:first-child')?.parentElement;
      if (!chatContainer) return;

      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'mb-4';
      userMessageDiv.innerHTML = `
          <div class="bg-accent1-light text-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs ml-auto">
              <p>${message}</p>
          </div>
      `;
      chatContainer.appendChild(userMessageDiv);
      inputElement.value = '';

      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'mb-4 typing-indicator';
      typingIndicator.innerHTML = `
          <div class="bg-primary-light text-gray-800 p-3 rounded-lg rounded-tr-none max-w-xs flex">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
          </div>
      `;
      chatContainer.appendChild(typingIndicator);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      setTimeout(() => {
        if (typingIndicator && typingIndicator.parentNode === chatContainer) {
          chatContainer.removeChild(typingIndicator);
        }
        let aiResponse = '';
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          aiResponse = "Hello! I'm your Shakti Margam AI assistant. How can I help your business today?";
        } else if (lowerMessage.includes('business') && lowerMessage.includes('plan')) {
          aiResponse = "Creating a business plan is crucial. Start with your mission, target market analysis, and financial projections. Would you like me to help you with a specific section?";
        } else if (lowerMessage.includes('funding') || lowerMessage.includes('loan')) {
          aiResponse = "There are several funding options for women entrepreneurs in Telangana, including WE-HUB grants, MUDRA loans, and Stand-Up India scheme. Would you like details on any specific program?";
        } else if (lowerMessage.includes('marketing') || lowerMessage.includes('social media')) {
          aiResponse = "For effective marketing, focus on identifying your target audience and creating content that resonates with them. Social media platforms like Instagram and Facebook are great for showcasing products.";
        } else {
          aiResponse = "That's a great question. I'd recommend focusing on your unique strengths as an entrepreneur and identifying market gaps. Would you like more specific guidance on this topic?";
        }
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'mb-4';
        aiMessageDiv.innerHTML = `
            <div class="bg-primary-light text-gray-800 p-3 rounded-lg rounded-tr-none max-w-xs">
                <p>${aiResponse}</p>
            </div>
        `;
        chatContainer.appendChild(aiMessageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1000);
    };

    const inputElement = document.getElementById('demo-chat-input');
    if (inputElement) {
      inputElement.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          window.sendDemoMessage();
        }
      });
    }
    window.API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '';
    return () => {
      const el = document.getElementById('demo-chat-input');
      if (el) {
        el.removeEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            window.sendDemoMessage();
          }
        });
      }
    };
  }, []);

  return (
    <div ref={pageRef} className="font-sans min-h-screen flex flex-col">
      <SplashRedirect />
      <style>
        {`
          .bg-primary { background-color: #00695C; }
          .bg-primary-light { background-color: #E0F2F1; }
          .bg-primary-dark { background-color: #004D40; }
          .text-primary { color: #00695C; }
          .bg-accent1 { background-color: #D81B60; }
          .bg-accent1-light { background-color: #FCE4EC; }
          .bg-accent2 { background-color: #FFC107; }
          .bg-accent2-light { background-color: #FFF8E1; }
          .bg-accent3 { background-color: #FF5722; }
          .bg-accent3-light { background-color: #FBE9E7; }
          .bg-accent4 { background-color: #5E35B1; }
          .bg-accent4-light { background-color: #EDE7F6; }
          .border-primary { border-color: #00695C; }
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
          .float-animation { animation: float 6s ease-in-out infinite; }
          .bg-gradient-hero { background: linear-gradient(to bottom, #E0F2F1, #FFFFFF); }
          .bg-gradient-cta { background: linear-gradient(to right, #00695C, #D81B60); }
          .pochampally-overlay { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300695C' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
          .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
          .typing-indicator .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #00695C; margin-right: 4px; animation: typing 1.4s infinite ease-in-out both; }
          .typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
          .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes typing { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; } 40% { transform: scale(1); opacity: 1; } }
        `}
      </style>

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Shakti Margam Logo" className="h-15 mr-3" style={{ height: "60px" }} />
            <div>
              <h1 className="text-2xl font-bold text-primary">Shakti Margam</h1>
              <p className="text-sm text-gray-500">Empowering Women Entrepreneurs in Telangana</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
            <a href="javascript:void(0)" onClick={() => window.redirectToAssistant()} className="text-gray-700 hover:text-primary font-medium">Assistant</a>
            <Link to="/resources" className="text-gray-700 hover:text-primary font-medium">Resources</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium">About</Link>
          </nav>
          <div className="hidden md:block">
            <AnimatedButton
              onClick={() => window.redirectToAssistant()}
              variant="primary"
              size="medium"
              ariaLabel="Get Started"
            >
              Get Started
            </AnimatedButton>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40">
            <nav className="flex flex-col space-y-2 px-4 py-4">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <a href="javascript:void(0)" onClick={() => { window.redirectToAssistant(); setIsMobileMenuOpen(false); }} className="text-gray-700 hover:text-primary font-medium py-2">Assistant</a>
              <Link to="/resources" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <AnimatedButton
                onClick={() => { window.redirectToAssistant(); setIsMobileMenuOpen(false); }}
                variant="primary"
                size="medium"
                className="w-full mt-2"
                ariaLabel="Get Started"
              >
                Get Started
              </AnimatedButton>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 opacity-15 pochampally-overlay"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16 md:pb-24"> {/* Adjusted padding */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                <span className="inline-block px-4 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-5">
                  AI Assistant for Women Entrepreneurs
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
                  The Path of <span className="text-accent3">Empowerment</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                  Shakti Margam empowers women entrepreneurs in Telangana with personalized AI guidance for business growth, social media strategy, financial planning, and more.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <AnimatedButton
                    onClick={() => window.redirectToAssistant()}
                    variant="primary"
                    size="large"
                    className="text-center"
                    ariaLabel="Get Started"
                  >
                    Get Started
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    variant="outline"
                    size="large"
                    className="text-center"
                    ariaLabel="Explore Features"
                  >
                    Explore Features
                  </AnimatedButton>
                </div>
                <p className="mt-6 text-gray-600 text-sm">
                  Trusted by 5,000+ women entrepreneurs in Telangana
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
                <div className="relative float-animation">
                  <div className="bg-primary rounded-3xl p-3 shadow-2xl max-w-xs">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      <div className="bg-primary p-4 text-white flex items-center justify-between">
                        <div className="flex items-center">
                          <img src="/logo.png" alt="Shakti Margam Logo" className="h-8 mr-2" />
                          <span className="font-bold">SHAKTI MARGAM</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 h-80 sm:h-96 overflow-y-auto"> {/* Responsive height and scroll */}
                        <div className="mb-4">
                          <div className="bg-accent1-light text-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs ml-auto">
                            <p>Hi, I need help with my business strategy.</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="bg-primary-light text-gray-800 p-3 rounded-lg rounded-tr-none max-w-xs">
                            <p>Consider focusing on social media to promote — try sharing content, engaging with followers, and leveraging posts to build an audience online.</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="bg-primary-light text-gray-800 p-3 rounded-lg rounded-tr-none max-w-xs">
                            <p>We should focus on strategies that help boost a fast-growing strategy. To grow, share your engagement—</p>
                          </div>
                        </div>
                        <div className="mt-auto sticky bottom-0 bg-gray-50 py-2"> {/* Sticky input */}
                          <div className="flex items-center bg-white rounded-full border border-gray-300 p-1">
                            <input type="text" id="demo-chat-input" placeholder="Message" className="flex-grow px-4 py-2 bg-transparent focus:outline-none" />
                            <button onClick={() => window.sendDemoMessage()} className="bg-primary text-white p-2 rounded-full">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-20 bg-white"> {/* Responsive padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
                Comprehensive Suite of Tools
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your AI-Powered Business Companion
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Shakti Margam provides personalized guidance across all aspects of your business journey, from startup to growth stage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-accent2-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('initial-assessment')}>
                <div className="bg-accent2 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent2 mb-2">Initial Business Assessment</h3>
                <p className="text-gray-600">Analyze your business idea, model, and current performance to identify strengths and areas for improvement.</p>
              </div>
              <div className="bg-accent1-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('telangana-market-insights')}>
                <div className="bg-accent1 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent1 mb-2">Market Intelligence</h3>
                <p className="text-gray-600">Get data on market size, trends, competitors, and opportunities specific to Telangana.</p>
              </div>
              <div className="bg-accent3-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('social-media-strategy')}>
                <div className="bg-accent3 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent3 mb-2">Social Media Strategy</h3>
                <p className="text-gray-600">Create customized social media plans for different platforms popular in Telangana.</p>
              </div>
              <div className="bg-accent4-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('financial-analysis')}>
                <div className="bg-accent4 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent4 mb-2">Financial Advisor</h3>
                <p className="text-gray-600">Guidance on cash flow management, funding opportunities for women entrepreneurs, and financial planning.</p>
              </div>
              <div className="bg-primary-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('customer-profiling')}>
                <div className="bg-primary bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Customer Profiling</h3>
                <p className="text-gray-600">Develop detailed customer personas based on Telangana's demographic data.</p>
              </div>
              <div className="bg-accent2-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('telangana-market-insights')}>
                <div className="bg-accent2 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent2 mb-2">Regional Festival Calendar</h3>
                <p className="text-gray-600">Integrate Telangana festival calendar with your business planning for seasonal promotions.</p>
              </div>
              <div className="bg-accent1-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('telangana-market-insights')}>
                <div className="bg-accent1 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent1 mb-2">Women Entrepreneur Network</h3>
                <p className="text-gray-600">Connect with other women entrepreneurs in similar industries across Telangana.</p>
              </div>
              <div className="bg-accent3-light rounded-lg p-6 shadow-md feature-card cursor-pointer" onClick={() => window.redirectToAssistantWithModule('telangana-market-insights')}>
                <div className="bg-accent3 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-accent3 mb-2">Government Scheme Navigator</h3>
                <p className="text-gray-600">Identify government schemes and programs you're eligible for with guidance on application processes.</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <AnimatedButton onClick={() => window.redirectToAssistant()} variant="primary" size="large" className="inline-block" ariaLabel="Explore All Features">Explore All Features</AnimatedButton>
            </div>
          </div>
        </section>

        <section id="success-stories" className="py-16 md:py-20 bg-gray-50"> {/* Responsive padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">Success Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hear from Women Entrepreneurs in Telangana</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real success stories from women who transformed their businesses with Shakti Margam's guidance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonials remain the same */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-accent1-light flex items-center justify-center mr-4"><svg className="h-8 w-8 text-accent1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg></div>
                  <div><h3 className="text-lg font-semibold">Lakshmi R.</h3><p className="text-gray-600">Handloom Business, Hyderabad</p></div>
                </div>
                <div className="mb-4"><div className="flex"><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div></div>
                <p className="text-gray-700 italic mb-4">"Shakti Margam helped me identify the perfect social media strategy for my handloom business. My online sales increased by 45% in just three months!"</p>
                <div className="text-sm text-gray-500">Using Shakti Margam since 2022</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-accent2-light flex items-center justify-center mr-4"><svg className="h-8 w-8 text-accent2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg></div>
                  <div><h3 className="text-lg font-semibold">Priya K.</h3><p className="text-gray-600">Natural Skincare, Warangal</p></div>
                </div>
                <div className="mb-4"><div className="flex"><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div></div>
                <p className="text-gray-700 italic mb-4">"The financial forecasting feature saved my business during a difficult season. I could see cash flow problems coming and took steps to prevent them."</p>
                <div className="text-sm text-gray-500">Using Shakti Margam since 2021</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-accent3-light flex items-center justify-center mr-4"><svg className="h-8 w-8 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg></div>
                  <div><h3 className="text-lg font-semibold">Sunitha M.</h3><p className="text-gray-600">Organic Food Startup, Nizamabad</p></div>
                </div>
                <div className="mb-4"><div className="flex"><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg className="h-5 w-5 text-accent3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div></div>
                <p className="text-gray-700 italic mb-4">"As a first-time entrepreneur, I had so many questions. Shakti Margam was like having a business expert available 24/7 to guide me through every step."</p>
                <div className="text-sm text-gray-500">Using Shakti Margam since 2023</div>
              </div>
            </div>
            <div className="text-center mt-12">
              <a href="#" className="inline-block px-6 py-3 bg-white text-primary border border-primary font-medium rounded-lg hover:bg-primary-light transition-colors duration-300">Read More Success Stories</a>
            </div>
          </div>
        </section>

        <section id="get-started" className="py-16 md:py-20 bg-gradient-cta"> {/* Responsive padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 md:p-12"> {/* Adjusted padding */}
                  <h2 className="text-3xl font-bold text-primary mb-4">Ready to Transform Your Business Journey?</h2>
                  <p className="text-gray-600 mb-8">Join thousands of women entrepreneurs in Telangana who are achieving their business goals with Shakti Margam's personalized AI guidance.</p>
                  <div className="space-y-4">
                    <div className="flex items-start"><svg className="h-6 w-6 text-accent2 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg><div><h3 className="font-semibold text-gray-900">Free to Get Started</h3><p className="text-gray-600">No credit card required. Start with our basic plan at no cost.</p></div></div>
                    <div className="flex items-start"><svg className="h-6 w-6 text-accent2 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg><div><h3 className="font-semibold text-gray-900">WE-HUB Partner</h3><p className="text-gray-600">Official partner of Telangana's WE-HUB initiative for women entrepreneurs.</p></div></div>
                    <div className="flex items-start"><svg className="h-6 w-6 text-accent2 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg><div><h3 className="font-semibold text-gray-900">Trusted by 5,000+ Users</h3><p className="text-gray-600">Join a growing community of successful women entrepreneurs.</p></div></div>
                  </div>
                  <div className="mt-8">
                    <button onClick={() => window.redirectToAssistant()} className="inline-block px-8 py-4 bg-primary text-white font-medium rounded-lg shadow-lg hover:bg-primary-dark transition-colors duration-300">Get Started Free</button>
                    <p className="text-sm text-gray-500 mt-2">No credit card required</p>
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold mb-3">Subscribe to our Newsletter</h3>
                      <p className="text-gray-600 mb-4">Get the latest updates and resources for women entrepreneurs.</p>
                      <form onSubmit={(e) => window.handleFormSubmit(e, 'newsletter')}>
                        <div className="flex">
                          <input type="email" name="email" placeholder="Your email address" required className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark transition-colors duration-300">Subscribe</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-primary-light p-6 md:p-12 flex items-center justify-center"> {/* Adjusted padding */}
                  <div className="text-center">
                    <div className="mb-6"><img src="/logo.png" alt="Shakti Margam Logo" className="h-16 mx-auto" /></div>
                    <blockquote className="text-xl italic text-gray-700 mb-6">"Shakti Margam has been instrumental in helping women entrepreneurs across Telangana realize their business potential."</blockquote>
                    <div className="flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mr-3"><svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg></div>
                      <div className="text-left"><h4 className="font-semibold">Sita Pallacholla</h4><p className="text-sm text-gray-600">Director, WE-HUB Telangana</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-auto"> {/* mt-auto for sticky footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <img src="/logo.png" alt="Shakti Margam Logo" className="h-12 mb-4" />
              <p className="text-gray-400 max-w-md">AI-powered assistant platform for women entrepreneurs in Telangana, providing personalized guidance for business growth.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg></a>
                <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm2.99 15h-2v-6h2v6zm-1-6.93c-.7 0-1.27-.57-1.27-1.27 0-.7.57-1.27 1.27-1.27.7 0 1.27.57 1.27 1.27 0 .7-.57 1.27-1.27 1.27zm4.01 6.93h-2v-3.5c0-.79-.18-1.5-1.25-1.5s-1.25.71-1.25 1.5V17h-2v-6h2v.92c.38-.35.86-.92 1.82-.92 1.94 0 2.68 1.28 2.68 2.94V17z"></path></svg></a>
                <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg></a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><a href="javascript:void(0)" onClick={() => window.redirectToAssistant()} className="text-gray-400 hover:text-white transition-colors">Assistant</a></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#success-stories" onClick={(e) => { e.preventDefault(); document.getElementById('success-stories')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                  <li><a href="javascript:void(0)" onClick={() => window.redirectToAssistant()} className="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors">All Resources</Link></li>
                  <li><a href="https://wehub.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">WE-HUB</a></li>
                  <li><Link to="/resources#government-schemes" className="text-gray-400 hover:text-white transition-colors">Government Schemes</Link></li>
                  <li><Link to="/resources#financial-support" className="text-gray-400 hover:text-white transition-colors">Financial Support</Link></li>
                  <li><Link to="/resources#market-insights" className="text-gray-400 hover:text-white transition-colors">Market Insights</Link></li>
                  <li><Link to="/resources#business-templates" className="text-gray-400 hover:text-white transition-colors">Business Templates</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Shakti Margam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

declare global {
  interface Window {
    redirectToAssistant: () => void;
    redirectToAssistantWithModule: (moduleId: string) => void;
    handleFormSubmit: (event: any, formType: string) => boolean;
    showSuccessMessage: (form: HTMLFormElement) => void;
    sendDemoMessage: () => void;
    API_ENDPOINT?: string;
  }
}

export default StaticLandingPage;
