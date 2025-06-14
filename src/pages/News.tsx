import { useState } from 'react';

const News = () => {
  const [latestNews] = useState([
    {
      id: 1,
      title: 'India announces squad for Zimbabwe T20Is',
      time: '10m ago',
      points: [
        'Ruturaj Gaikwad to lead the side.',
        'Several IPL performers included.',
        'No senior players like Kohli or Rohit.'
      ]
    },
    {
      id: 2,
      title: 'England finalize squad for India Test series',
      time: '30m ago',
      points: [
        'Anderson rested for the first two Tests.',
        'Stokes returns after injury layoff.',
        'Crawley named as vice-captain.'
      ]
    },
    {
      id: 3,
      title: 'Pakistan appoints Gary Kirsten as head coach',
      time: '1h ago',
      points: [
        'Kirsten signs 2-year contract.',
        'Focus on ODI and T20 World Cup prep.',
        'PCB shows confidence in his experience.'
      ]
    },
    {
      id: 4,
      title: 'Sri Lanka thrash South Africa in warm-up match',
      time: '2h ago',
      points: [
        'Sri Lanka chased 189 with 7 wickets in hand.',
        'Nissanka scored a quickfire 78.',
        'Bowling unit clicked early.'
      ]
    }
  ]);

  const featuredStories = [
    {
      title: 'The duality of being Kagiso Rabada, home and away',
      image: 'https://www.cricbuzz.com/a/img/v1/600x400/i1/c378148/20240608053058.jpeg',
      description: 'Rabada’s journey through tough conditions and home dominance shows his evolution as South Africa’s pace spearhead.',
    },
    {
      title: 'Pat Cummins scripts world record: 5-wicket haul in ICC final',
      image: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1GAi8r.img?w=768&h=432&m=6&x=560&y=145&s=145&d=145',
      description: 'Cummins becomes the first captain to take a 5-wicket haul in an ICC final, leading Australia to another world title.',
    },
    {
      title: 'Kohli’s legacy: Unmatched hunger across all formats',
      image: 'data:image/webp;base64,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',
      description: 'Virat Kohli continues to shine in all formats. His consistency and intensity remain unmatched in modern cricket.',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {/* Latest News */}
      <div className="col-span-1">
        <h2 className="text-xl font-bold mb-4">🗞️ Latest News</h2>
        <ul className="space-y-6">
          {latestNews.map(item => (
            <li key={item.id} className="border-b pb-4">
              <div className="font-medium text-base">{item.title}</div>
              <div className="text-gray-400 text-xs mb-2">{item.time}</div>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {item.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Stories */}
      <div className="col-span-2 space-y-8">
        <h2 className="text-xl font-bold mb-4">🌍 Featured Stories</h2>
        {featuredStories.map((story, index) => (
          <div key={index} className="bg-white shadow rounded overflow-hidden">
            <img src={story.image} alt={story.title} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{story.title}</h3>
              <p className="text-gray-600 mt-2">{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
