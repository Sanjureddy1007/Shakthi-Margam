import React, { useState } from 'react';

// Mock system settings
const mockSettings = {
  ai: {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    embeddingModel: 'text-embedding-3-small',
    temperature: 0.7,
    maxTokens: 1000,
    cacheEnabled: true,
    cacheTTL: 3600000, // 1 hour in milliseconds
  },
  vectorStore: {
    provider: 'pinecone',
    indexName: 'shakti-margam-index',
    topK: 5,
    reRankingEnabled: true,
    hybridSearchEnabled: true,
    vectorWeight: 0.7,
    keywordWeight: 0.3,
  },
  modules: {
    'initial-assessment': { enabled: true },
    'social-media-strategy': { enabled: true },
    'financial-analysis': { enabled: true },
    'telangana-market-insights': { enabled: true },
    'customer-profiling': { enabled: true },
    'government-schemes': { enabled: true },
  },
  security: {
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 900000, // 15 minutes in milliseconds
    jwtExpiration: '30d',
  },
  logging: {
    level: 'info',
    retention: '30d',
    errorNotificationsEnabled: true,
  }
};

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState<string>('ai');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedSettings, setEditedSettings] = useState(mockSettings);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  // Handle saving settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSettings(editedSettings);
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    }, 1000);
  };

  // Handle canceling edits
  const handleCancelEdits = () => {
    setEditedSettings(settings);
    setIsEditing(false);
  };

  // Handle input change
  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedSettings({
      ...editedSettings,
      [section]: {
        ...editedSettings[section as keyof typeof editedSettings],
        [field]: value
      }
    });
  };

  // Handle toggle change
  const handleToggleChange = (section: string, field: string) => {
    setEditedSettings({
      ...editedSettings,
      [section]: {
        ...editedSettings[section as keyof typeof editedSettings],
        [field]: !editedSettings[section as keyof typeof editedSettings][field]
      }
    });
  };

  // Handle module toggle
  const handleModuleToggle = (moduleId: string) => {
    setEditedSettings({
      ...editedSettings,
      modules: {
        ...editedSettings.modules,
        [moduleId]: {
          ...editedSettings.modules[moduleId],
          enabled: !editedSettings.modules[moduleId].enabled
        }
      }
    });
  };

  // Format module name for display
  const formatModuleName = (module: string) => {
    return module.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
            >
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdits}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <p className="font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex overflow-x-auto border-b">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'ai'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            AI Configuration
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'vectorStore'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vectorStore')}
          >
            Vector Store
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'modules'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('modules')}
          >
            Modules
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'security'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'logging'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('logging')}
          >
            Logging
          </button>
        </div>

        {/* AI Configuration */}
        <div className={`p-6 ${activeTab === 'ai' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Provider</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.ai.provider : settings.ai.provider}
                onChange={(e) => handleInputChange('ai', 'provider', e.target.value)}
                disabled={!isEditing}
              >
                <option value="openai">OpenAI</option>
                <option value="azure">Azure OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.ai.model : settings.ai.model}
                onChange={(e) => handleInputChange('ai', 'model', e.target.value)}
                disabled={!isEditing}
              >
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Embedding Model</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.ai.embeddingModel : settings.ai.embeddingModel}
                onChange={(e) => handleInputChange('ai', 'embeddingModel', e.target.value)}
                disabled={!isEditing}
              >
                <option value="text-embedding-3-small">text-embedding-3-small</option>
                <option value="text-embedding-3-large">text-embedding-3-large</option>
                <option value="text-embedding-ada-002">text-embedding-ada-002</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.ai.temperature : settings.ai.temperature}
                onChange={(e) => handleInputChange('ai', 'temperature', parseFloat(e.target.value))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.ai.maxTokens : settings.ai.maxTokens}
                onChange={(e) => handleInputChange('ai', 'maxTokens', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isEditing ? editedSettings.ai.cacheEnabled : settings.ai.cacheEnabled}
                  onChange={() => handleToggleChange('ai', 'cacheEnabled')}
                  disabled={!isEditing}
                />
                <span className="ml-2 text-sm text-gray-700">Enable Response Caching</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cache TTL (ms)</label>
              <input
                type="number"
                min="60000"
                step="60000"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.ai.cacheTTL : settings.ai.cacheTTL}
                onChange={(e) => handleInputChange('ai', 'cacheTTL', parseInt(e.target.value))}
                disabled={!isEditing || !editedSettings.ai.cacheEnabled}
              />
            </div>
          </div>
        </div>

        {/* Vector Store */}
        <div className={`p-6 ${activeTab === 'vectorStore' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vector Store Provider</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.vectorStore.provider : settings.vectorStore.provider}
                onChange={(e) => handleInputChange('vectorStore', 'provider', e.target.value)}
                disabled={!isEditing}
              >
                <option value="pinecone">Pinecone</option>
                <option value="weaviate">Weaviate</option>
                <option value="mongodb">MongoDB Atlas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Index Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.vectorStore.indexName : settings.vectorStore.indexName}
                onChange={(e) => handleInputChange('vectorStore', 'indexName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top K Results</label>
              <input
                type="number"
                min="1"
                max="20"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.vectorStore.topK : settings.vectorStore.topK}
                onChange={(e) => handleInputChange('vectorStore', 'topK', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isEditing ? editedSettings.vectorStore.reRankingEnabled : settings.vectorStore.reRankingEnabled}
                  onChange={() => handleToggleChange('vectorStore', 'reRankingEnabled')}
                  disabled={!isEditing}
                />
                <span className="ml-2 text-sm text-gray-700">Enable Re-ranking</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isEditing ? editedSettings.vectorStore.hybridSearchEnabled : settings.vectorStore.hybridSearchEnabled}
                  onChange={() => handleToggleChange('vectorStore', 'hybridSearchEnabled')}
                  disabled={!isEditing}
                />
                <span className="ml-2 text-sm text-gray-700">Enable Hybrid Search</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vector Weight</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.vectorStore.vectorWeight : settings.vectorStore.vectorWeight}
                onChange={(e) => handleInputChange('vectorStore', 'vectorWeight', parseFloat(e.target.value))}
                disabled={!isEditing || !editedSettings.vectorStore.hybridSearchEnabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keyword Weight</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.vectorStore.keywordWeight : settings.vectorStore.keywordWeight}
                onChange={(e) => handleInputChange('vectorStore', 'keywordWeight', parseFloat(e.target.value))}
                disabled={!isEditing || !editedSettings.vectorStore.hybridSearchEnabled}
              />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className={`p-6 ${activeTab === 'modules' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(settings.modules).map((moduleId) => (
              <div key={moduleId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-800">{formatModuleName(moduleId)}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isEditing ? editedSettings.modules[moduleId].enabled : settings.modules[moduleId].enabled}
                      onChange={() => handleModuleToggle(moduleId)}
                      disabled={!isEditing}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer ${
                      (isEditing ? editedSettings.modules[moduleId].enabled : settings.modules[moduleId].enabled) 
                        ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-primary' 
                        : ''
                    } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className={`p-6 ${activeTab === 'security' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isEditing ? editedSettings.security.rateLimitEnabled : settings.security.rateLimitEnabled}
                  onChange={() => handleToggleChange('security', 'rateLimitEnabled')}
                  disabled={!isEditing}
                />
                <span className="ml-2 text-sm text-gray-700">Enable Rate Limiting</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit Requests</label>
              <input
                type="number"
                min="10"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.security.rateLimitRequests : settings.security.rateLimitRequests}
                onChange={(e) => handleInputChange('security', 'rateLimitRequests', parseInt(e.target.value))}
                disabled={!isEditing || !editedSettings.security.rateLimitEnabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit Window (ms)</label>
              <input
                type="number"
                min="60000"
                step="60000"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.security.rateLimitWindow : settings.security.rateLimitWindow}
                onChange={(e) => handleInputChange('security', 'rateLimitWindow', parseInt(e.target.value))}
                disabled={!isEditing || !editedSettings.security.rateLimitEnabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JWT Expiration</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.security.jwtExpiration : settings.security.jwtExpiration}
                onChange={(e) => handleInputChange('security', 'jwtExpiration', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Logging */}
        <div className={`p-6 ${activeTab === 'logging' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.logging.level : settings.logging.level}
                onChange={(e) => handleInputChange('logging', 'level', e.target.value)}
                disabled={!isEditing}
              >
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Log Retention</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={isEditing ? editedSettings.logging.retention : settings.logging.retention}
                onChange={(e) => handleInputChange('logging', 'retention', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isEditing ? editedSettings.logging.errorNotificationsEnabled : settings.logging.errorNotificationsEnabled}
                  onChange={() => handleToggleChange('logging', 'errorNotificationsEnabled')}
                  disabled={!isEditing}
                />
                <span className="ml-2 text-sm text-gray-700">Enable Error Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
