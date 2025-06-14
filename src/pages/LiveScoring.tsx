import { useState, useEffect } from 'react';

type MatchScore = {
  inning: string;
  runs: number;
  wickets: number;
  overs: number;
};

type Match = {
  id: string;
  name: string;
  matchType: string;
  score?: MatchScore[];
  status: string;
  venue: string;
};

const LiveScoring = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          'https://api.cricapi.com/v1/currentMatches?apikey=5e6fada2-de9d-439b-a7bb-036ed11919a3&offset=0'
        );
        const data = await response.json();

        if (data.status === 'success') {
          setMatches(data.data);
        } else {
          console.error('Failed to fetch matches:', data.message);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();

    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedMatchId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🏏 Live Cricket Scores</h2>

      {loading ? (
        <p>Loading live scores...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {matches.map((match) => {
            const isExpanded = expandedMatchId === match.id;

            return (
              <div
                key={match.id}
                className="bg-white shadow-md p-4 rounded-md border hover:shadow-lg transition cursor-pointer"
                onClick={() => toggleExpand(match.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-lg">{match.name}</div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {match.matchType}
                  </span>
                </div>
                <div className="text-green-700 font-bold text-xl">
                  {match.score && match.score.length > 0
                    ? match.score[0].inning + ' - ' + match.score[0].runs + '/' + match.score[0].wickets + ` (${match.score[0].overs} ov)`
                    : 'Score not available'}
                </div>
                <div className="text-sm text-gray-500 mt-2">{match.status}</div>
                <div className="text-xs text-gray-400 mt-1">📍 {match.venue}</div>

                {isExpanded && match.score && match.score.length > 1 && (
                  <div className="mt-4 border-t pt-2 text-sm text-gray-700">
                    <strong>Full Scoreboard:</strong>
                    <ul className="mt-1 space-y-1">
                      {match.score.map((s, index) => (
                        <li key={index}>
                          {s.inning}: {s.runs}/{s.wickets} ({s.overs} ov)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveScoring;
