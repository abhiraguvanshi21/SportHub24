import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'white',
  padding = 'lg',
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gradient-to-r from-slate-50 to-green-50',
    gradient: 'gradient-primary text-white',
    dark: 'bg-gray-900 text-white',
  };
  
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  };
  
  const classes = `${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`;
  
  return (
    <section className={classes}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;