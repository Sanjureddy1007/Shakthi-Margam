import React, { useRef, useEffect, useState } from 'react';

interface SidebarNavIndicatorProps {
  activeItemId: string;
  containerRef: React.RefObject<HTMLElement>;
}

const SidebarNavIndicator: React.FC<SidebarNavIndicatorProps> = ({
  activeItemId,
  containerRef,
}) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: 'translateY(0)',
    opacity: 0,
  });

  useEffect(() => {
    if (!containerRef.current || !indicatorRef.current) return;

    // Find the active nav item
    const activeItem = containerRef.current.querySelector(`#${activeItemId}`);
    
    if (activeItem) {
      // Get the position and dimensions of the active item
      const { offsetTop, offsetWidth } = activeItem as HTMLElement;
      
      // Update the indicator style
      setIndicatorStyle({
        width: offsetWidth,
        transform: `translateY(${offsetTop}px)`,
        opacity: 1,
      });
    }
  }, [activeItemId, containerRef]);

  return (
    <div
      ref={indicatorRef}
      className="nav-indicator"
      style={{
        width: `${indicatorStyle.width}px`,
        transform: indicatorStyle.transform,
        opacity: indicatorStyle.opacity,
      }}
      aria-hidden="true"
    />
  );
};

export default SidebarNavIndicator;
