import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { resetScroll, applyScrollingFix } from '../utils/scrollUtils';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.35,
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Create a ref for the motion div
  const motionDivRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when component mounts
  useEffect(() => {
    // Apply scrolling fixes
    resetScroll();

    // Apply scrolling fix to the motion div
    applyScrollingFix(motionDivRef.current);

    // Add a small delay to ensure scrolling is enabled after animations
    const timer = setTimeout(() => {
      resetScroll();
      applyScrollingFix(motionDivRef.current);
    }, 100);

    return () => {
      // Clean up when component unmounts
      clearTimeout(timer);
      resetScroll(); // Ensure scrolling is enabled when navigating away
    };
  }, []);

  return (
    <motion.div
      ref={motionDivRef}
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full overflow-auto"
      style={{ overflowY: 'auto', minHeight: '100%' }}
      onAnimationComplete={() => {
        // Ensure scrolling is enabled after animation completes
        resetScroll();
        applyScrollingFix(motionDivRef.current);
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
