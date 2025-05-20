import React, { useState } from 'react';
import { assistantModules, AssistantModule } from '../../data/updated-assistant-modules';
import { useAIAssistant } from '../../context/AIAssistantProvider';

interface ModuleSelectorProps {
  className?: string;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ className }) => {
  const { activeModule, setActiveModule } = useAIAssistant();
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the currently active module
  const currentModule = assistantModules.find(module => module.id === activeModule) || assistantModules[0];

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    setIsExpanded(false);
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'clipboard-check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'share':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        );
      case 'banknotes':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'map':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Get color class based on color name
  const getColorClass = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return 'text-primary bg-primary-light';
      case 'accent1':
        return 'text-accent1 bg-accent1-light';
      case 'accent2':
        return 'text-accent2 bg-accent2-light';
      case 'accent3':
        return 'text-accent3 bg-accent3-light';
      case 'accent4':
        return 'text-accent4 bg-accent4-light';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current module button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${getColorClass(currentModule.color)}`}>
            {getIconComponent(currentModule.icon)}
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">{currentModule.title}</p>
            <p className="text-sm text-gray-500 truncate max-w-xs">{currentModule.description}</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Module dropdown */}
      {isExpanded && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
          {assistantModules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module.id)}
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 ${
                module.id === activeModule ? 'bg-gray-50' : ''
              } ${
                module.id === assistantModules[assistantModules.length - 1].id
                  ? 'rounded-b-lg'
                  : ''
              } ${module.id === assistantModules[0].id ? 'rounded-t-lg' : ''}`}
            >
              <div className={`p-2 rounded-full mr-3 ${getColorClass(module.color)}`}>
                {getIconComponent(module.icon)}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{module.title}</p>
                <p className="text-sm text-gray-500 truncate max-w-xs">{module.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleSelector;
