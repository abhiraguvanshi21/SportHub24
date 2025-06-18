import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Globe, Search, Filter, Eye, MessageCircle, Share2, Bookmark, Play, Calendar, Users, Award, Target, Activity } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'breaking' | 'match-report' | 'transfer' | 'analysis' | 'interview' | 'stats' | 'upcoming';
  timestamp: string;
  author: string;
  image: string;
  views: number;
  comments: number;
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
}

interface LiveUpdate {
  id: string;
  text: string;
  timestamp: string;
  type: 'score' | 'wicket' | 'boundary' | 'milestone' | 'news';
  match?: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Latest 2025 sports news articles
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'ICC Champions Trophy 2025: India Squad Announced with Rohit as Captain',
      summary: 'BCCI announces a 15-member squad for the Champions Trophy 2025 in Pakistan with Virat Kohli returning as captain after the T20 World Cup triumph.',
      content: 'The Board of Control for Cricket in India has announced a strong 15-member squad for the ICC Champions Trophy 2025...',
      category: 'breaking',
      timestamp: '2025-01-15T10:30:00Z',
      author: 'Rajesh Kumar',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 25420,
      comments: 334,
      tags: ['India', 'Champions Trophy', 'Squad', 'Kohli', '2025'],
      isBreaking: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'IPL 2025 Mega Auction: Record-Breaking ₹27 Crore Bid for Star All-rounder',
      summary: 'The IPL 2025 mega auction sees unprecedented bidding wars with a mystery all-rounder fetching the highest price in IPL history.',
      content: 'In a thrilling bidding war that lasted over 15 minutes, the mystery player became the most expensive...',
      category: 'transfer',
      timestamp: '2025-01-14T15:45:00Z',
      author: 'Priya Sharma',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 18900,
      comments: 289,
      tags: ['IPL', 'Auction', '2025', 'Transfer', 'Record'],
      isFeatured: true
    },
    {
      id: '3',
      title: 'England vs Australia: Ashes 2025 Schedule Revealed',
      summary: 'Cricket Australia announces the complete schedule for the Ashes 2025 series with five Tests across iconic venues.',
      content: 'The much-anticipated Ashes 2025 series will commence on November 21, 2025, at the Gabba...',
      category: 'upcoming',
      timestamp: '2025-01-14T12:20:00Z',
      author: 'Mike Thompson',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 14567,
      comments: 198,
      tags: ['Ashes', '2025', 'England', 'Australia', 'Schedule']
    },
    {
      id: '4',
      title: 'Women\'s T20 World Cup 2025: Australia Announces Squad',
      summary: 'Australia Women announce their 15-member squad for the T20 World Cup 2025 in Bangladesh with Meg Lanning returning from retirement.',
      content: 'In a surprising turn of events, Meg Lanning has announced her return to international cricket...',
      category: 'breaking',
      timestamp: '2025-01-14T09:15:00Z',
      author: 'Sarah Johnson',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 12345,
      comments: 167,
      tags: ['Women\'s Cricket', 'T20 World Cup', '2025', 'Australia', 'Lanning'],
      isBreaking: true
    },
    {
      id: '5',
      title: 'ICC Introduces New Playing Conditions for 2025 Season',
      summary: 'International Cricket Council announces significant changes to playing conditions including new DRS protocols and over-rate penalties.',
      content: 'The ICC has introduced several new playing conditions that will come into effect from March 2025...',
      category: 'breaking',
      timestamp: '2025-01-13T16:30:00Z',
      author: 'David Wilson',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 9876,
      comments: 134,
      tags: ['ICC', 'Playing Conditions', '2025', 'DRS', 'Rules'],
      isBreaking: true
    },
    {
      id: '6',
      title: 'Pakistan Super League 2025: Draft Results and Team Analysis',
      summary: 'Complete analysis of PSL 2025 draft results with surprise picks and strategic team building by all six franchises.',
      content: 'The Pakistan Super League 2025 draft concluded with several surprising picks and strategic moves...',
      category: 'analysis',
      timestamp: '2025-01-13T14:00:00Z',
      author: 'Ahmed Hassan',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 8765,
      comments: 112,
      tags: ['PSL', '2025', 'Draft', 'Pakistan', 'Analysis']
    },
    {
      id: '7',
      title: 'Border-Gavaskar Trophy 2025: India\'s Tour of Australia Dates Confirmed',
      summary: 'Cricket Australia and BCCI confirm the dates for the highly anticipated Border-Gavaskar Trophy 2025 with five Tests.',
      content: 'The Border-Gavaskar Trophy 2025 will be played across five Test matches starting December 2025...',
      category: 'upcoming',
      timestamp: '2025-01-12T11:45:00Z',
      author: 'Rohit Gupta',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 16789,
      comments: 245,
      tags: ['Border-Gavaskar', '2025', 'India', 'Australia', 'Test Series']
    },
    {
      id: '8',
      title: 'T20 World Cup 2026: USA and West Indies Joint Hosting Confirmed',
      summary: 'ICC officially announces USA and West Indies as joint hosts for the T20 World Cup 2026, marking cricket\'s return to American soil.',
      content: 'In a historic decision, the ICC has confirmed that the T20 World Cup 2026 will be jointly hosted...',
      category: 'upcoming',
      timestamp: '2025-01-12T08:30:00Z',
      author: 'Jennifer Martinez',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 13456,
      comments: 189,
      tags: ['T20 World Cup', '2026', 'USA', 'West Indies', 'Hosting']
    },
    {
      id: '9',
      title: 'Rohit Sharma Announces Retirement from T20 Internationals',
      summary: 'Indian captain Rohit Sharma announces his retirement from T20 internationals after leading India to T20 World Cup victory.',
      content: 'In an emotional press conference, Rohit Sharma announced his decision to retire from T20 internationals...',
      category: 'breaking',
      timestamp: '2025-01-11T17:20:00Z',
      author: 'Suresh Menon',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 22345,
      comments: 456,
      tags: ['Rohit Sharma', 'Retirement', 'T20I', 'India', 'Captain'],
      isBreaking: true,
      isFeatured: true
    },
    {
      id: '10',
      title: 'Cricket Returns to Olympics 2028: LA Games to Feature T20 Format',
      summary: 'IOC confirms cricket\'s inclusion in the 2028 Los Angeles Olympics with T20 format for both men\'s and women\'s competitions.',
      content: 'The International Olympic Committee has officially confirmed cricket\'s return to the Olympics...',
      category: 'upcoming',
      timestamp: '2025-01-11T13:15:00Z',
      author: 'Olympic Correspondent',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 19876,
      comments: 298,
      tags: ['Olympics', '2028', 'LA', 'Cricket', 'T20'],
      isFeatured: true
    },
    {
      id: '11',
      title: 'Big Bash League 2025: New Team Adelaide Strikers 2.0 Announced',
      summary: 'Cricket Australia announces expansion of BBL with a new team based in Adelaide, bringing the total teams to nine.',
      content: 'In a major expansion move, Cricket Australia has announced the addition of a ninth team...',
      category: 'transfer',
      timestamp: '2025-01-10T16:00:00Z',
      author: 'BBL Reporter',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 7890,
      comments: 123,
      tags: ['BBL', '2025', 'Adelaide', 'Expansion', 'New Team']
    },
    {
      id: '12',
      title: 'WTC Final 2025: India vs Australia at Lord\'s Confirmed',
      summary: 'ICC confirms India and Australia will face off in the World Test Championship Final 2025 at Lord\'s Cricket Ground.',
      content: 'After a thrilling WTC cycle, India and Australia have secured their spots in the final...',
      category: 'upcoming',
      timestamp: '2025-01-10T12:30:00Z',
      author: 'WTC Correspondent',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 15678,
      comments: 234,
      tags: ['WTC Final', '2025', 'India', 'Australia', 'Lord\'s']
    }
  ];

  // Live updates for 2025
  const mockLiveUpdates: LiveUpdate[] = [
    {
      id: '1',
      text: 'BREAKING: Virat Kohli named captain for Champions Trophy 2025 squad announcement',
      timestamp: '2025-01-15T11:45:00Z',
      type: 'news'
    },
    {
      id: '2',
      text: 'IPL 2025 Auction: Mystery player sold for record ₹27 crores to Mumbai Indians',
      timestamp: '2025-01-15T11:30:00Z',
      type: 'news'
    },
    {
      id: '3',
      text: 'Ashes 2025: Complete schedule released, series starts November 21 at Gabba',
      timestamp: '2025-01-15T11:15:00Z',
      type: 'news'
    },
    {
      id: '4',
      text: 'Women\'s T20 World Cup 2025: Meg Lanning returns to Australian squad',
      timestamp: '2025-01-15T11:00:00Z',
      type: 'news'
    },
    {
      id: '5',
      text: 'ICC announces new DRS protocols effective from March 2025',
      timestamp: '2025-01-15T10:45:00Z',
      type: 'news'
    },
    {
      id: '6',
      text: 'PSL 2025 Draft: Babar Azam retained by Peshawar Zalmi as captain',
      timestamp: '2025-01-15T10:30:00Z',
      type: 'news'
    },
    {
      id: '7',
      text: 'Border-Gavaskar Trophy 2025: Five-Test series confirmed for December',
      timestamp: '2025-01-15T10:15:00Z',
      type: 'news'
    },
    {
      id: '8',
      text: 'T20 World Cup 2026: USA-West Indies joint hosting officially confirmed',
      timestamp: '2025-01-15T10:00:00Z',
      type: 'news'
    }
  ];

  useEffect(() => {
    setArticles(mockArticles);
    setLiveUpdates(mockLiveUpdates);
    setFilteredArticles(mockArticles);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate live updates every 45 seconds
    const updateInterval = setInterval(() => {
      const newUpdate: LiveUpdate = {
        id: Date.now().toString(),
        text: 'Live Update: Cricket action continues across the globe with exciting developments!',
        timestamp: new Date().toISOString(),
        type: 'news'
      };
      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
    }, 45000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(updateInterval);
    };
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchTerm]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breaking': return <TrendingUp className="h-4 w-4" />;
      case 'match-report': return <Target className="h-4 w-4" />;
      case 'transfer': return <Users className="h-4 w-4" />;
      case 'analysis': return <Activity className="h-4 w-4" />;
      case 'interview': return <MessageCircle className="h-4 w-4" />;
      case 'stats': return <Award className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breaking': return 'bg-red-100 text-red-700 border-red-200';
      case 'match-report': return 'bg-green-100 text-green-700 border-green-200';
      case 'transfer': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'analysis': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'interview': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'stats': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'wicket': return '🏏';
      case 'boundary': return '🔥';
      case 'milestone': return '🎯';
      case 'news': return '📰';
      default: return '⚡';
    }
  };

  const categories = [
    { id: 'all', label: 'All News', count: articles.length },
    { id: 'breaking', label: 'Breaking', count: articles.filter(a => a.category === 'breaking').length },
    { id: 'upcoming', label: 'Upcoming Events', count: articles.filter(a => a.category === 'upcoming').length },
    { id: 'match-report', label: 'Match Reports', count: articles.filter(a => a.category === 'match-report').length },
    { id: 'transfer', label: 'Transfers', count: articles.filter(a => a.category === 'transfer').length },
    { id: 'analysis', label: 'Analysis', count: articles.filter(a => a.category === 'analysis').length },
    { id: 'interview', label: 'Interviews', count: articles.filter(a => a.category === 'interview').length },
    { id: 'stats', label: 'Statistics', count: articles.filter(a => a.category === 'stats').length }
  ];

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cricket News Hub 2025</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              Latest cricket news, upcoming tournaments, and comprehensive coverage of the 2025 cricket season
            </p>
            <div className="flex items-center justify-center space-x-4 text-green-100">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Live Updates Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breaking News Ticker */}
      <section className="bg-red-600 text-white py-3 overflow-hidden">
        <div className="flex items-center">
          <div className="bg-red-800 px-4 py-2 font-bold text-sm whitespace-nowrap">
            BREAKING NEWS 2025
          </div>
          <div className="flex animate-scroll">
            <span className="px-8 text-sm">
              🚨 Champions Trophy 2025: India squad announced with Kohli as captain
            </span>
            <span className="px-8 text-sm">
              🏏 IPL 2025 Mega Auction: Record ₹27 crore bid breaks all previous records
            </span>
            <span className="px-8 text-sm">
              🎯 Ashes 2025: Complete schedule released, series starts November at Gabba
            </span>
            <span className="px-8 text-sm">
              📅 Cricket returns to Olympics 2028 in Los Angeles with T20 format
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search 2025 cricket news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Articles */}
            {filteredArticles.filter(article => article.isFeatured).length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories 2025</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.filter(article => article.isFeatured).slice(0, 2).map((article) => (
                    <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="relative">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex space-x-2">
                          {article.isBreaking && (
                            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              BREAKING
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                            {getCategoryIcon(article.category)}
                            <span className="ml-1 capitalize">{article.category.replace('-', ' ')}</span>
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{article.author}</span>
                            <span>{formatTimeAgo(article.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{article.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{article.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Cricket News 2025</h2>
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          {article.isBreaking && (
                            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              BREAKING
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                            {getCategoryIcon(article.category)}
                            <span className="ml-1 capitalize">{article.category.replace('-', ' ')}</span>
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{article.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{article.author}</span>
                            <span>{formatTimeAgo(article.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{article.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{article.comments}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                <Bookmark className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Updates */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Live Updates 2025</h3>
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveUpdates.map((update) => (
                  <div key={update.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">{getUpdateTypeIcon(update.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{update.text}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {update.match && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {update.match}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{formatTimeAgo(update.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events 2025 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events 2025</h3>
              <div className="space-y-3">
                {[
                  { event: 'Champions Trophy 2025', date: 'Feb 19 - Mar 9', location: 'Pakistan' },
                  { event: 'IPL 2025', date: 'Mar 22 - May 26', location: 'India' },
                  { event: 'Women\'s T20 WC', date: 'Oct 3 - Oct 20', location: 'Bangladesh' },
                  { event: 'Ashes 2025', date: 'Nov 21 - Jan 7', location: 'Australia' },
                  { event: 'Border-Gavaskar Trophy', date: 'Dec 26 - Jan 7', location: 'Australia' }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900">{event.event}</div>
                      <div className="text-xs text-gray-600">{event.location}</div>
                    </div>
                    <div className="text-sm text-yellow-700 font-medium">{event.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics 2025 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Topics 2025</h3>
              <div className="space-y-3">
                {['#ChampionsTrophy2025', '#IPL2025MegaAuction', '#Ashes2025', '#Olympics2028Cricket', '#WTC2025Final', '#T20WorldCup2026'].map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-900">{topic}</span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats 2025 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">2025 Season Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Articles Published</span>
                  <span className="font-bold text-green-600">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Upcoming Tournaments</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Breaking News</span>
                  <span className="font-bold text-red-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-bold text-purple-600">2.8M</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Stay Updated with 2025 Cricket</h3>
              <p className="text-green-100 text-sm mb-4">Get the latest cricket news and tournament updates delivered to your inbox</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Subscribe to 2025 Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;