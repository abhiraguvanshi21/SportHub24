import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Globe, Search, Filter, Eye, MessageCircle, Share2, Bookmark, Play, Calendar, Users, Award, Target, Activity } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'breaking' | 'match-report' | 'transfer' | 'analysis' | 'interview' | 'stats';
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

  // Mock data for news articles
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'India Announces Squad for Australia Tour: Kohli Returns as Captain',
      summary: 'BCCI announces a strong 18-member squad for the upcoming Australia tour with Virat Kohli returning as captain after a brief break.',
      content: 'The Board of Control for Cricket in India (BCCI) has announced a formidable 18-member squad for the highly anticipated tour of Australia...',
      category: 'breaking',
      timestamp: '2024-01-15T10:30:00Z',
      author: 'Rajesh Kumar',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 15420,
      comments: 234,
      tags: ['India', 'Australia', 'Squad', 'Kohli'],
      isBreaking: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'IPL 2024 Auction: Mumbai Indians Break Bank for Star All-rounder',
      summary: 'Mumbai Indians secure the services of England all-rounder for a record-breaking ₹18.5 crores in the IPL 2024 auction.',
      content: 'In a thrilling bidding war that lasted over 10 minutes, Mumbai Indians successfully acquired...',
      category: 'transfer',
      timestamp: '2024-01-15T09:15:00Z',
      author: 'Priya Sharma',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 12890,
      comments: 189,
      tags: ['IPL', 'Auction', 'Mumbai Indians', 'Transfer'],
      isFeatured: true
    },
    {
      id: '3',
      title: 'England vs New Zealand: Root Scores Magnificent Double Century',
      summary: 'Joe Root\'s unbeaten 234 puts England in commanding position on Day 2 of the first Test at Lord\'s.',
      content: 'Joe Root played one of the finest innings of his career, remaining unbeaten on 234 as England posted...',
      category: 'match-report',
      timestamp: '2024-01-15T08:45:00Z',
      author: 'Mike Thompson',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 9876,
      comments: 156,
      tags: ['England', 'New Zealand', 'Test', 'Root', 'Double Century']
    },
    {
      id: '4',
      title: 'Women\'s Cricket World Cup: Australia Dominates Group Stage',
      summary: 'Australia Women complete a perfect group stage campaign with a comprehensive victory over South Africa.',
      content: 'The defending champions Australia Women have maintained their perfect record in the group stage...',
      category: 'match-report',
      timestamp: '2024-01-15T07:20:00Z',
      author: 'Sarah Johnson',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 7654,
      comments: 98,
      tags: ['Women\'s Cricket', 'World Cup', 'Australia', 'Group Stage']
    },
    {
      id: '5',
      title: 'T20 World Cup 2024: Venue Changes Due to Weather Concerns',
      summary: 'ICC announces venue changes for three T20 World Cup matches due to adverse weather conditions in the Caribbean.',
      content: 'The International Cricket Council has announced changes to the venue for three crucial matches...',
      category: 'breaking',
      timestamp: '2024-01-15T06:00:00Z',
      author: 'David Wilson',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 11234,
      comments: 167,
      tags: ['T20 World Cup', 'Venue', 'Weather', 'ICC'],
      isBreaking: true
    },
    {
      id: '6',
      title: 'Statistical Analysis: The Rise of Spin Bowling in Modern T20 Cricket',
      summary: 'A deep dive into how spin bowling has evolved and become increasingly effective in the shortest format of the game.',
      content: 'Over the past five years, spin bowling has undergone a remarkable transformation in T20 cricket...',
      category: 'analysis',
      timestamp: '2024-01-15T05:30:00Z',
      author: 'Dr. Analytics',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 5432,
      comments: 78,
      tags: ['Analysis', 'Spin Bowling', 'T20', 'Statistics']
    }
  ];

  // Mock live updates
  const mockLiveUpdates: LiveUpdate[] = [
    {
      id: '1',
      text: 'WICKET! Kohli c Smith b Cummins 89 - What a catch by Smith at slip!',
      timestamp: '2024-01-15T11:45:00Z',
      type: 'wicket',
      match: 'IND vs AUS'
    },
    {
      id: '2',
      text: 'BOUNDARY! Rohit Sharma hits a magnificent cover drive for four',
      timestamp: '2024-01-15T11:42:00Z',
      type: 'boundary',
      match: 'IND vs AUS'
    },
    {
      id: '3',
      text: 'MILESTONE! India reaches 300 runs in 45.2 overs',
      timestamp: '2024-01-15T11:40:00Z',
      type: 'milestone',
      match: 'IND vs AUS'
    },
    {
      id: '4',
      text: 'BREAKING: Pakistan announces 15-member squad for England series',
      timestamp: '2024-01-15T11:35:00Z',
      type: 'news'
    },
    {
      id: '5',
      text: 'SIX! Hardik Pandya launches it over deep mid-wicket for a massive six!',
      timestamp: '2024-01-15T11:30:00Z',
      type: 'boundary',
      match: 'IND vs AUS'
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

    // Simulate live updates every 30 seconds
    const updateInterval = setInterval(() => {
      const newUpdate: LiveUpdate = {
        id: Date.now().toString(),
        text: 'New update: Match continues with exciting action!',
        timestamp: new Date().toISOString(),
        type: 'score',
        match: 'Live Match'
      };
      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
    }, 30000);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cricket News Hub</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              Stay updated with the latest cricket news, live scores, and in-depth analysis
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
            BREAKING NEWS
          </div>
          <div className="flex animate-scroll">
            <span className="px-8 text-sm">
              🚨 India announces squad for Australia tour with Kohli as captain
            </span>
            <span className="px-8 text-sm">
              🏏 IPL 2024 auction sees record-breaking bids for star players
            </span>
            <span className="px-8 text-sm">
              🎯 England vs New Zealand: Root scores magnificent double century
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
                    placeholder="Search news, teams, players..."
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
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
                <h3 className="text-lg font-bold text-gray-900">Live Updates</h3>
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

            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {['#IPL2024', '#IndvsAus', '#T20WorldCup', '#WomensCricket', '#TestChampionship'].map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-900">{topic}</span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Articles Published</span>
                  <span className="font-bold text-green-600">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Live Matches</span>
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Breaking News</span>
                  <span className="font-bold text-red-600">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-bold text-purple-600">1.2M</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
              <p className="text-green-100 text-sm mb-4">Get the latest cricket news delivered to your inbox</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Subscribe Now
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