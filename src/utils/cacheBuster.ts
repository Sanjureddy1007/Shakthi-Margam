/**
 * Utility function to add cache-busting query parameters to asset URLs
 * 
 * @param url The original URL of the asset
 * @returns The URL with a cache-busting query parameter
 */
export const cacheBust = (url: string): string => {
  // Use a timestamp or a version number
  const timestamp = Date.now();
  
  // Check if the URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  
  // Return the URL with the cache-busting parameter
  return `${url}${separator}v=${timestamp}`;
};

/**
 * Utility function to add a fixed version number to asset URLs
 * This is useful for production builds where you want consistent URLs
 * 
 * @param url The original URL of the asset
 * @returns The URL with a version query parameter
 */
export const addVersion = (url: string): string => {
  // Use a fixed version number from environment or build time
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
  
  // Check if the URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  
  // Return the URL with the version parameter
  return `${url}${separator}v=${version}`;
};
