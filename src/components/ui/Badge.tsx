import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'upcoming' | 'completed' | 'default';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'status-badge';
  
  const variantClasses = {
    live: 'status-live',
    upcoming: 'status-upcoming',
    completed: 'status-completed',
    default: 'bg-gray-100 text-gray-700',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={classes}>
      {variant === 'live' && <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>}
      {children}
    </span>
  );
};

export default Badge;