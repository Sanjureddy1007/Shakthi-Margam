const logger = require('../../utils/logger');

// Import module handlers
const initialAssessmentModule = require('./initialAssessmentModule');
const telanganaMarketInsightsModule = require('./telanganaMarketInsightsModule');
// Use the enhanced social media strategy handler
const socialMediaStrategyModule = require('./social-media-strategy.handler');
const financialAnalysisModule = require('./financialAnalysisModule');
const customerProfilingModule = require('./customerProfilingModule');
const governmentSchemesModule = require('./governmentSchemesModule');

// Module registry
const moduleRegistry = {
  'initial-assessment': initialAssessmentModule,
  'telangana-market-insights': telanganaMarketInsightsModule,
  'social-media-strategy': socialMediaStrategyModule,
  'financial-analysis': financialAnalysisModule,
  'customer-profiling': customerProfilingModule,
  'government-schemes': governmentSchemesModule
};

/**
 * Get a module handler by ID
 * @param {string} moduleId - The module ID
 * @returns {Object} - The module handler
 */
exports.getModuleHandler = (moduleId) => {
  const moduleHandler = moduleRegistry[moduleId];

  if (!moduleHandler) {
    logger.warn(`Module handler not found for module ID: ${moduleId}`);
    return moduleRegistry['initial-assessment']; // Default to initial assessment
  }

  return moduleHandler;
};

/**
 * Get all module handlers
 * @returns {Object} - All module handlers
 */
exports.getAllModuleHandlers = () => {
  return moduleRegistry;
};

/**
 * Get module IDs
 * @returns {Array<string>} - All module IDs
 */
exports.getModuleIds = () => {
  return Object.keys(moduleRegistry);
};

/**
 * Get module info
 * @param {string} moduleId - The module ID
 * @returns {Object} - The module info
 */
exports.getModuleInfo = (moduleId) => {
  const moduleHandler = moduleRegistry[moduleId];

  if (!moduleHandler) {
    return null;
  }

  return {
    id: moduleId,
    name: moduleHandler.name,
    description: moduleHandler.description,
    capabilities: moduleHandler.capabilities
  };
};
