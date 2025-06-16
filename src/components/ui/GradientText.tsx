import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
}) => {
  return (
    <span className={`text-gradient ${className}`}>
      {children}
    </span>
  );
};

export default GradientText;