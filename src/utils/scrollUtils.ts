/**
 * Utility functions for handling scrolling issues
 */

/**
 * Ensures that scrolling is enabled on the page
 * This function forcefully enables scrolling on the document and body elements
 */
export const enableScrolling = (): void => {
  // Remove any classes that might disable scrolling
  document.documentElement.classList.remove('splash-page');
  document.body.classList.remove('splash-page');
  
  // Force enable scrolling with inline styles
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.documentElement.style.height = 'auto';
  document.body.style.height = 'auto';
  document.documentElement.style.position = 'static';
  document.body.style.position = 'static';
  
  // Reset any transform properties that might interfere with scrolling
  document.documentElement.style.transform = 'none';
  document.body.style.transform = 'none';
};

/**
 * Scrolls to the top of the page
 */
export const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

/**
 * Resets scroll position and ensures scrolling is enabled
 * Useful when navigating between pages
 */
export const resetScroll = (): void => {
  enableScrolling();
  scrollToTop();
};

/**
 * Applies scrolling fix to a specific element
 * @param element The element to apply the scrolling fix to
 */
export const applyScrollingFix = (element: HTMLElement | null): void => {
  if (!element) return;
  
  element.style.overflow = 'auto';
  element.style.height = 'auto';
  element.style.minHeight = '100%';
  element.style.position = 'static';
};
