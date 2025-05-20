/**
 * Shakti Margam Assistant Initializer
 * This script initializes the assistant page with the selected module from localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a selected module in localStorage
    const selectedModule = localStorage.getItem('shaktiMargamActiveModule');
    
    if (selectedModule) {
        console.log('Initializing assistant with module:', selectedModule);
        
        // Find the AIAssistantProvider context in the React app
        // This will be available after the React app has initialized
        setTimeout(() => {
            try {
                // If we're using the React app, we can access the context through window
                if (window.ShaktiMargam && window.ShaktiMargam.setActiveModule) {
                    window.ShaktiMargam.setActiveModule(selectedModule);
                    console.log('Module set successfully');
                    
                    // Clear the localStorage item after it's been used
                    localStorage.removeItem('shaktiMargamActiveModule');
                } else {
                    console.log('AIAssistantProvider not found, will retry');
                    
                    // Retry a few times in case the React app hasn't fully loaded
                    let retryCount = 0;
                    const maxRetries = 5;
                    
                    const retryInterval = setInterval(() => {
                        if (window.ShaktiMargam && window.ShaktiMargam.setActiveModule) {
                            window.ShaktiMargam.setActiveModule(selectedModule);
                            console.log('Module set successfully on retry');
                            
                            // Clear the localStorage item after it's been used
                            localStorage.removeItem('shaktiMargamActiveModule');
                            
                            clearInterval(retryInterval);
                        } else {
                            retryCount++;
                            console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
                            
                            if (retryCount >= maxRetries) {
                                console.log('Max retries reached, giving up');
                                clearInterval(retryInterval);
                            }
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error initializing assistant with module:', error);
            }
        }, 500);
    }
});
