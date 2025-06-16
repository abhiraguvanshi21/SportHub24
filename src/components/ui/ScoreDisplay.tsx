import React from 'react';

interface ScoreDisplayProps {
  runs: number;
  wickets: number;
  overs: number;
  runRate?: number;
  className?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  runs,
  wickets,
  overs,
  runRate,
  className = '',
}) => {
  return (
    <div className={`score-display ${className}`}>
      <div className="score-number">
        {runs}/{wickets}
      </div>
      <div className="text-sm text-gray-600 mt-2">
        ({overs} overs)
        {runRate && (
          <span className="ml-2">
            RR: {runRate}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;