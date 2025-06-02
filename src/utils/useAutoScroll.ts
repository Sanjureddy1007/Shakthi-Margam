import { useRef, useEffect, RefObject } from 'react';

interface AutoScrollOptions {
  /** The scroll behavior ('auto', 'smooth', etc.). Defaults to 'smooth'. */
  behavior?: ScrollBehavior;
  /** Array of dependencies that trigger scrolling when changed. Crucial for triggering scroll on new content. */
  dependencies?: any[];
  /** 
   * A value between 0 and 1 to control conditional auto-scrolling.
   * If set to 1 (default), auto-scrolling will always occur when dependencies change.
   * If set to less than 1 (e.g., 0.9), auto-scrolling will only occur if the user is already scrolled near the bottom 
   * (i.e., the visible bottom of the scrollable area is within (1 - threshold) * scrollHeight from the actual bottom).
   * For example, a threshold of 0.9 means auto-scroll if the user is within the bottom 10% of the scrollable content.
   * A threshold of 0 means auto-scroll if the user is within the entire scrollable height from the bottom (effectively always, similar to 1 but calculation differs slightly).
   * It's generally recommended to use values like 0.8, 0.9, or 1.
   * Defaults to 1.
   */
  threshold?: number;
}

/**
 * A custom React hook that automatically scrolls an HTML element to its bottom.
 * Scrolling is triggered when values in the `dependencies` array change,
 * subject to the `threshold` condition.
 *
 * @param options Configuration options for the auto-scroll behavior.
 * @returns A ref object to be attached to the scrollable HTML element.
 *
 * @example
 * const messagesEndRef = useAutoScroll<HTMLDivElement>({ dependencies: [messages], threshold: 0.9 });
 * // ...
 * <div ref={messagesEndRef} style={{ height: '300px', overflowY: 'auto' }}>
 *   {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
 * </div>
 */
export const useAutoScroll = <T extends HTMLElement>(
  options: AutoScrollOptions = {}
): RefObject<T> => {
  const {
    behavior = 'smooth',
    dependencies = [],
    threshold = 1,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const scrollElement = ref.current;
    if (!scrollElement) {
      return;
    }

    const isUserNearBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      // Distance from the bottom of the scrollable content to the bottom of the visible viewport
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      // Tolerance for floating point comparisons or slight rendering differences
      const tolerance = 1; 

      // If threshold is 1 or more, we effectively mean "always scroll if dependencies change"
      // or "scroll if user is at the very bottom".
      // The `threshold >= 1` check handles the "always scroll" case directly.
      // For threshold < 1, we check if the user is within the specified percentage from the bottom.
      // scrollHeight * (1 - threshold) calculates the maximum allowed distance from the bottom
      // for auto-scrolling to occur.
      return distanceFromBottom <= scrollHeight * (1 - threshold) + tolerance;
    };

    if (threshold >= 1 || isUserNearBottom()) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior,
      });
    }
  }, [behavior, threshold, ...dependencies]); // Effect dependencies

  return ref;
};

export default useAutoScroll;
