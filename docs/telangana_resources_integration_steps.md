# Telangana Resources Integration Steps

This document provides step-by-step instructions for integrating the Telangana-specific market insights and funding resources into the Shakti Margam application.

## Prerequisites

- Ensure you have access to the Shakti Margam codebase
- Node.js and npm/pnpm installed
- Basic knowledge of React and TypeScript

## Integration Steps

### 1. Copy Data Files

1. Copy the following files from `/workspace/src/data/` to `/workspace/shakti-margam/src/data/`:
   ```
   telangana-funding.ts
   telangana-market-insights.ts
   telangana-resources-integration.ts
   ```

2. Update the assistant modules by either:
   - Copying the contents of `updated-assistant-modules.ts` to replace the existing `assistant-modules.ts`, or
   - Adding the new "Telangana Market Insights" module to the existing assistant modules array

### 2. Add UI Components

1. Create a new directory for Telangana-specific components if it doesn't exist:
   ```
   mkdir -p /workspace/shakti-margam/src/components/assistant/telangana
   ```

2. Copy the UI component:
   ```
   cp /workspace/src/components/assistant/TelanganaMarketInsightsPanel.tsx /workspace/shakti-margam/src/components/assistant/telangana/
   ```

3. Copy the page component:
   ```
   cp /workspace/src/pages/TelanganaMarketInsightsPage.tsx /workspace/shakti-margam/src/pages/
   ```

### 3. Update Application Routing

1. Open the main routing file (likely in `App.tsx` or a router configuration file)

2. Add the new route for the Telangana Market Insights page:

   ```tsx
   import TelanganaMarketInsightsPage from './pages/TelanganaMarketInsightsPage';
   
   // Add this to your routes
   <Route path="/assistant/telangana-insights" element={<TelanganaMarketInsightsPage />} />
   ```

### 4. Update Assistant Module Navigation

1. Open the relevant assistant navigation component (likely in `src/components/assistant/ModuleSelector.tsx` or similar)

2. Add the new module to the navigation options:

   ```tsx
   import { assistantModules } from '../../data/assistant-modules';
   
   // The assistantModules array now includes the Telangana Market Insights module
   // Make sure the UI renders this new module in the module selection interface
   ```

### 5. Integrate with AI Assistant Logic

1. Open the main AI assistant logic file(s) (likely in `src/components/assistant/ChatInterface.tsx` or similar)

2. Import the Telangana resources integration module:

   ```tsx
   import { generateTelanganaMarketResponse } from '../../data/telangana-resources-integration';
   ```

3. Add logic to process queries related to Telangana resources:

   ```tsx
   // Add to your existing message processing logic
   const processMessage = (userMessage: string) => {
     const lowerMessage = userMessage.toLowerCase();
     
     // Check if the message is related to Telangana resources
     if (
       lowerMessage.includes('telangana') && 
       (
         lowerMessage.includes('funding') || 
         lowerMessage.includes('business') || 
         lowerMessage.includes('market') || 
         lowerMessage.includes('industry') ||
         lowerMessage.includes('regulations') ||
         lowerMessage.includes('success stories')
       )
     ) {
       // Use the Telangana resources integration
       const response = generateTelanganaMarketResponse(userMessage);
       // Format and display the response based on its type
       return formatTelanganaResponse(response);
     }
     
     // Continue with other message processing
     // ...
   };
   
   const formatTelanganaResponse = (response: any) => {
     // Format the response based on its type (funding, industry, etc.)
     // Return appropriate UI components or formatted text
   };
   ```

### 6. Add Link to Resources Page

1. Open the resources page component (likely in `src/pages/ResourcesPage.tsx` or similar)

2. Add a link or card for the Telangana Market Insights:

   ```tsx
   <ResourceCard
     title="Telangana Market Insights"
     description="Access Telangana-specific market information, funding opportunities, and success stories to grow your business locally."
     icon="map"
     link="/assistant/telangana-insights"
   />
   ```

### 7. Copy Documentation

1. Copy the documentation files to the appropriate documentation directory:
   ```
   cp /workspace/docs/telangana_market_insights_integration.md /workspace/shakti-margam/docs/
   cp /workspace/docs/telangana_resources_integration_steps.md /workspace/shakti-margam/docs/
   ```

### 8. Update AI Assistant Prompts

If the application uses specific prompts or training data for the AI assistant:

1. Update the relevant prompt files to include information about the Telangana-specific resources
2. Add examples of how to respond to queries about Telangana resources
3. Ensure the AI knows to direct users to the dedicated Telangana Market Insights page for detailed information

### 9. Test the Integration

1. Start the development server:
   ```
   cd /workspace/shakti-margam
   pnpm run dev
   ```

2. Test the following:
   - Navigation to the Telangana Market Insights page
   - Filtering and browsing different categories of information
   - AI assistant responses to queries about Telangana resources
   - Links to external resources
   - Mobile responsiveness of the UI components

### 10. Build and Deploy

1. Create a production build:
   ```
   cd /workspace/shakti-margam
   pnpm run build
   ```

2. Deploy according to your project's deployment workflow

## Troubleshooting

- **TypeScript Errors**: Ensure all imports and type definitions are correctly set up
- **Component Errors**: Check that the component hierarchy and props match your application's structure
- **Styling Issues**: Adjust any styling to match your application's design system
- **AI Integration Issues**: Verify that the AI assistant correctly identifies and processes Telangana-related queries

## Maintenance

Set up a quarterly review process to ensure:

1. The funding opportunities are current and accurate
2. Market insights and trends are updated with the latest information
3. Regulations reflect any changes in government policies
4. New success stories are added as they become available

By following these steps, you will successfully integrate the Telangana-specific market insights and funding resources into the Shakti Margam application, providing valuable localized information to women entrepreneurs in Telangana.