import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  ariaLabel?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  ariaLabel,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  // Base classes
  let baseClasses = 'rounded-md font-medium transition-all focus:outline-none ';

  // Variant classes
  switch (variant) {
    case 'primary':
      baseClasses += 'bg-[#6A2C70] text-white hover:bg-[#5a2560] ';
      break;
    case 'secondary':
      baseClasses += 'bg-[#E84A5F] text-white hover:bg-[#d43a4f] ';
      break;
    case 'outline':
      baseClasses += 'bg-transparent border border-[#6A2C70] text-[#6A2C70] hover:bg-[#6A2C70] hover:text-white ';
      break;
    case 'text':
      baseClasses += 'bg-transparent text-[#6A2C70] hover:bg-[#f8f4f9] ';
      break;
  }

  // Size classes
  switch (size) {
    case 'small':
      baseClasses += 'text-sm py-1 px-3 ';
      break;
    case 'medium':
      baseClasses += 'text-base py-2 px-4 ';
      break;
    case 'large':
      baseClasses += 'text-lg py-3 px-6 ';
      break;
  }

  // Width classes
  if (fullWidth) {
    baseClasses += 'w-full ';
  }

  // Disabled classes
  if (disabled) {
    baseClasses += 'opacity-50 cursor-not-allowed ';
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      setIsClicked(true);
      onClick(e);
      
      // Reset the clicked state after animation completes
      setTimeout(() => {
        setIsClicked(false);
      }, 600);
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      className={`${baseClasses} ${className} ${isClicked ? 'clicked' : ''}`}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        y: -2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30 
      }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
