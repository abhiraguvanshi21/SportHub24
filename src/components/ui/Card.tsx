import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  glass = false,
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'hover-lift' : '';
  const gradientClasses = gradient ? 'border-gradient' : '';
  const glassClasses = glass ? 'glass-effect' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${gradientClasses} ${glassClasses} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;