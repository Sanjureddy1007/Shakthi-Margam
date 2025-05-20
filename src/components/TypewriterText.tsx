import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  speed = 20, // ms per character
  onComplete,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Reset state when text changes
    setDisplayedText('');
    setIsComplete(false);
    
    // Delay before starting animation
    timeout = setTimeout(() => {
      let currentIndex = 0;
      
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(prev => prev + text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);
      
      return () => clearInterval(intervalId);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay, speed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
};

export default TypewriterText;
