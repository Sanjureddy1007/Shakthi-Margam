import React, { useState, useRef, useEffect } from 'react';
import { useAIAssistant } from '../../context/AIAssistantProvider';
import StructuredResponseRenderer from './StructuredResponseRenderer';
import { Message } from '../../context/AIAssistantProvider';

interface EnhancedChatInterfaceProps {
  className?: string;
}

// Enhanced message type that can include structured data
export interface EnhancedMessage extends Message {
  metadata?: {
    type?: string;
    module?: string;
    sources?: Array<{
      id: string;
      source: string;
      category: string;
    }>;
    platform?: string;
    [key: string]: any;
  };
  structuredData?: any;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ className }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isProcessing, activeModule } = useAIAssistant();
  const [enhancedMessages, setEnhancedMessages] = useState<EnhancedMessage[]>([]);
  const [showSources, setShowSources] = useState<boolean>(false);

  // Convert regular messages to enhanced messages
  useEffect(() => {
    const convertedMessages = messages.map(msg => {
      return {
        ...msg,
        metadata: (msg as EnhancedMessage).metadata || {}
      } as EnhancedMessage;
    });
    setEnhancedMessages(convertedMessages);
  }, [messages]);

  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Scroll to bottom only when new messages are added, not on initial page load
  useEffect(() => {
    // Only scroll if:
    // 1. It's not the initial page load, AND
    // 2. There are messages to display, AND
    // 3. The user has interacted with the chat (sent or received a message)
    if (!isInitialLoad && enhancedMessages.length > 0 && messages.length > 0) {
      // Use a small delay to ensure the DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    // After first render, set isInitialLoad to false
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [enhancedMessages, isInitialLoad, messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  // Determine if a message has sources
  const hasSources = (message: EnhancedMessage) => {
    return message.metadata?.sources && message.metadata.sources.length > 0;
  };

  // Render message content based on type
  const renderMessageContent = (message: EnhancedMessage) => {
    // If the message has structured data or a specific type, use the structured renderer
    if (message.metadata?.type || message.structuredData) {
      return (
        <StructuredResponseRenderer
          content={message.content}
          metadata={message.metadata}
          structuredData={message.structuredData}
          module={message.metadata?.module || activeModule || 'general'}
        />
      );
    }

    // Otherwise, render as plain text
    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {enhancedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium">Welcome to Shakti Margam</h3>
              <p className="mt-2">How can I assist you with your business today?</p>
            </div>
          </div>
        ) : (
          enhancedMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div
                className={`max-w-3/4 rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                } ${message.role === 'assistant' ? 'w-full max-w-3xl' : ''}`}
              >
                {renderMessageContent(message)}

                {/* Sources section */}
                {message.role === 'assistant' && hasSources(message) && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setShowSources(!showSources)}
                      className="text-xs text-gray-500 hover:text-primary flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={showSources ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                        />
                      </svg>
                      {showSources ? "Hide sources" : "Show sources"}
                    </button>

                    {showSources && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p className="font-medium">Sources:</p>
                        <ul className="list-disc list-inside">
                          {message.metadata?.sources.map((source, idx) => (
                            <li key={idx}>{source.source} ({source.category})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={`bg-primary text-white rounded-r-lg px-4 py-2 font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedChatInterface;
