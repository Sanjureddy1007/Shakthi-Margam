import React, { useState } from 'react';
import { useAIAssistant } from '../../context/AIAssistantProvider';

interface FourCsStrategyBuilderProps {
  className?: string;
}

interface StrategyItem {
  id: string;
  content: string;
  completed: boolean;
}

interface StrategySection {
  id: string;
  title: string;
  description: string;
  items: StrategyItem[];
}

const FourCsStrategyBuilder: React.FC<FourCsStrategyBuilderProps> = ({ className }) => {
  const { sendMessage } = useAIAssistant();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [strategy, setStrategy] = useState<StrategySection[]>([
    {
      id: 'captivate',
      title: 'Captivate',
      description: 'Attract attention and generate interest',
      items: [
        { id: 'captivate_1', content: 'Create eye-catching visuals', completed: false },
        { id: 'captivate_2', content: 'Develop compelling headlines', completed: false },
        { id: 'captivate_3', content: 'Use storytelling techniques', completed: false },
      ]
    },
    {
      id: 'cultivate',
      title: 'Cultivate',
      description: 'Build relationships and engage audience',
      items: [
        { id: 'cultivate_1', content: 'Respond to comments and messages', completed: false },
        { id: 'cultivate_2', content: 'Create interactive content', completed: false },
        { id: 'cultivate_3', content: 'Maintain consistent posting schedule', completed: false },
      ]
    },
    {
      id: 'convince',
      title: 'Convince',
      description: 'Build trust and demonstrate expertise',
      items: [
        { id: 'convince_1', content: 'Share testimonials and reviews', completed: false },
        { id: 'convince_2', content: 'Provide educational content', completed: false },
        { id: 'convince_3', content: 'Showcase case studies', completed: false },
      ]
    },
    {
      id: 'convert',
      title: 'Convert',
      description: 'Turn followers into customers',
      items: [
        { id: 'convert_1', content: 'Create clear calls-to-action', completed: false },
        { id: 'convert_2', content: 'Offer limited-time promotions', completed: false },
        { id: 'convert_3', content: 'Develop lead magnets', completed: false },
      ]
    }
  ]);

  const [newItemText, setNewItemText] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('captivate');

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(e.target.value);
    
    // Ask AI for platform-specific recommendations
    sendMessage(`Please provide specific social media strategy recommendations for ${e.target.value} using the 4Cs framework.`);
  };

  const handleItemToggle = (sectionId: string, itemId: string) => {
    setStrategy(strategy.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          })
        };
      }
      return section;
    }));
  };

  const handleAddItem = (sectionId: string) => {
    if (!newItemText.trim()) return;
    
    setStrategy(strategy.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [
            ...section.items,
            {
              id: `${sectionId}_${Date.now()}`,
              content: newItemText,
              completed: false
            }
          ]
        };
      }
      return section;
    }));
    
    setNewItemText('');
  };

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    setStrategy(strategy.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
  };

  const handleGetSuggestions = (sectionId: string) => {
    const sectionTitle = strategy.find(s => s.id === sectionId)?.title || '';
    sendMessage(`Please suggest 3 specific strategies for the ${sectionTitle} phase of the 4Cs framework for ${selectedPlatform}.`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="border-b p-4">
        <h2 className="text-lg font-medium text-gray-900">4Cs Social Media Strategy Builder</h2>
        <p className="text-sm text-gray-500 mt-1">
          Build your social media strategy using the 4Cs framework: Captivate, Cultivate, Convince, and Convert.
        </p>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <select
            value={selectedPlatform}
            onChange={handlePlatformChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="whatsapp">WhatsApp Business</option>
          </select>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex border-b">
          {strategy.map(section => (
            <button
              key={section.id}
              className={`px-4 py-2 text-sm font-medium ${
                activeSection === section.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </button>
          ))}
        </div>
        
        {strategy.map(section => (
          <div
            key={section.id}
            className={`mt-4 ${activeSection === section.id ? 'block' : 'hidden'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-medium text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <button
                onClick={() => handleGetSuggestions(section.id)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Get Suggestions
              </button>
            </div>
            
            <ul className="mt-4 space-y-2">
              {section.items.map(item => (
                <li key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleItemToggle(section.id, item.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className={`ml-2 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {item.content}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(section.id, item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 flex">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add new strategy item..."
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
              <button
                onClick={() => handleAddItem(section.id)}
                className="bg-primary text-white rounded-r-md px-4 py-2 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourCsStrategyBuilder;
