import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'button' | 'circle' | 'card' | 'avatar' | 'custom';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  width,
  height,
  count = 1,
  className = '',
  style = {},
}) => {
  // Base classes for all skeleton types
  let baseClasses = 'skeleton-loader ';

  // Add type-specific classes
  baseClasses += type ? `${type} ` : '';

  // Add custom classes
  baseClasses += className;

  // Create custom style with width and height if provided
  const customStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  // Render multiple skeleton loaders if count > 1
  if (count > 1) {
    return (
      <div className="skeleton-loader-group">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={baseClasses}
              style={customStyle}
              aria-hidden="true"
            />
          ))}
      </div>
    );
  }

  // Render a single skeleton loader
  return (
    <div
      className={baseClasses}
      style={customStyle}
      aria-hidden="true"
    />
  );
};

export default SkeletonLoader;
