import React, { useState } from 'react';

interface AnimatedFormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const AnimatedFormInput: React.FC<AnimatedFormInputProps> = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  error,
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    if (onChange) onChange(e);
  };

  // Determine if the label should be floating
  const isFloating = isFocused || hasValue;

  return (
    <div className={`form-group relative mb-4 ${className}`}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-control w-full px-3 py-2 border-b ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none bg-transparent transition-all duration-300 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      
      {/* Animated underline */}
      <div className="input-underline"></div>
      
      {/* Floating label */}
      <label
        htmlFor={id}
        className={`form-label absolute left-3 transition-all duration-300 ${
          isFloating
            ? 'transform -translate-y-6 scale-75 text-primary origin-left'
            : 'transform translate-y-0 text-gray-500'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Error message */}
      {error && (
        <div
          id={`${id}-error`}
          className="text-red-500 text-xs mt-1 absolute"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AnimatedFormInput;
