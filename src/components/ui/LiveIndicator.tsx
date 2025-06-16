import React from 'react';

interface LiveIndicatorProps {
  className?: string;
  text?: string;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  className = '',
  text = 'LIVE',
}) => {
  return (
    <span className={`live-indicator ${className}`}>
      {text}
    </span>
  );
};

export default LiveIndicator;