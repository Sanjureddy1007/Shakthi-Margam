import React from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';

interface AnimatedChatMessageProps {
  message: string;
  isUser?: boolean;
  animate?: boolean;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

const AnimatedChatMessage: React.FC<AnimatedChatMessageProps> = ({
  message,
  isUser = false,
  animate = true,
  delay = 0,
  onComplete,
  className = '',
}) => {
  // Define animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        delay: delay / 1000, // Convert ms to seconds for framer-motion
      }
    }
  };

  // Determine message style based on sender
  const messageClasses = isUser
    ? 'bg-accent1-light text-gray-800 p-3 rounded-lg rounded-tr-none max-w-xs ml-auto'
    : 'bg-primary-light text-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs';

  return (
    <motion.div
      className={`mb-4 ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={messageClasses}>
        {animate ? (
          <TypewriterText 
            text={message} 
            delay={delay} 
            onComplete={onComplete}
          />
        ) : (
          <p>{message}</p>
        )}
      </div>
    </motion.div>
  );
};

export default AnimatedChatMessage;
