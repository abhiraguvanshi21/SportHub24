import { useState } from 'react';

const LiveScoring = () => {
  const [matches] = useState([
    {
      id: 1,
      teams: 'AUS vs RSA',
      status: 'Day 2: Lunch Break - South Africa trail by 91 runs',
      score: ['AUS 212', 'RSA 121/5'],
      matchType: 'Test',
      location: 'The Oval, London',
      time: 'Ongoing'
    },
    {
      id: 2,
      teams: 'IRE vs WI',
      status: 'Today, 7:30 PM',
      score: ['-', '-'],
      matchType: 'T20I',
      location: 'Dublin',
      time: 'Upcoming'
    },
    {
      id: 3,
      teams: 'SCO vs NED',
      status: 'Scotland opt to bat',
      score: ['SCO 160/3 (28)', 'NED -'],
      matchType: 'World Cup',
      location: 'Edinburgh',
      time: 'Live'
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🏏 Live Cricket Scores</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {matches.map(match => (
          <div key={match.id} className="bg-white shadow-md p-4 rounded-md border hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-lg">{match.teams}</div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {match.matchType}
              </span>
            </div>
            <div className="text-green-700 font-bold text-xl">
              {match.score[0]}<br />{match.score[1]}
            </div>
            <div className="text-sm text-gray-500 mt-2">{match.status}</div>
            <div className="text-xs text-gray-400 mt-1">📍 {match.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveScoring;
