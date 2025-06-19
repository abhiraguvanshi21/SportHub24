import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Search, Filter, Eye, MessageCircle, Share2, Bookmark } from 'lucide-react';

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
      image: 'https://news24online.com/wp-content/uploads/2025/01/Untitled-design-96.jpg',
      views: 25420,
      comments: 334,
      tags: ['India', 'Champions Trophy', 'Squad', 'Kohli', '2025'],
      isBreaking: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'IPL 2025 Mega Auction: Record-Breaking ₹27 Crore Bid for Star Pant',
      summary: 'The IPL 2025 mega auction sees unprecedented bidding wars with a mystery Batsman fetching the highest price in IPL history.',
      content: 'In a thrilling bidding war that lasted over 15 minutes, the mystery player became the most expensive...',
      category: 'transfer',
      timestamp: '2025-01-14T15:45:00Z',
      author: 'Priya Sharma',
      image: 'https://news24online.com/wp-content/uploads/2024/12/Rishabh-Pant-4.jpg',
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
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIF.%252fQKXZvohLLbS5nWbVtlF2Q%26r%3D0%26pid%3DApi&f=1&ipt=a5c235c67d9c0b1fbb775e2e7f766494813e0609ace499f9c99fdee31eebe60c&ipo=images',
      views: 14567,
      comments: 198,
      tags: ['Ashes', '2025', 'England', 'Australia', 'Schedule']
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

    return () => {
      clearInterval(timeInterval);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breaking': return 'bg-red-100 text-red-700 border-red-200';
      case 'match-report': return 'bg-red-100 text-red-700 border-red-200';
      case 'transfer': return 'bg-red-200 text-red-800 border-red-300';
      case 'analysis': return 'bg-red-100 text-red-700 border-red-200';
      case 'interview': return 'bg-red-200 text-red-800 border-red-300';
      case 'stats': return 'bg-red-100 text-red-700 border-red-200';
      case 'upcoming': return 'bg-red-200 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const categories = [
    { id: 'all', label: 'All News', count: articles.length },
    { id: 'breaking', label: 'Breaking', count: articles.filter(a => a.category === 'breaking').length },
    { id: 'upcoming', label: 'Upcoming Events', count: articles.filter(a => a.category === 'upcoming').length },
    { id: 'match-report', label: 'Match Reports', count: articles.filter(a => a.category === 'match-report').length },
    { id: 'transfer', label: 'Transfers', count: articles.filter(a => a.category === 'transfer').length },
    { id: 'analysis', label: 'Analysis', count: articles.filter(a => a.category === 'analysis').length }
  ];

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cricket News Hub 2025</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-8">
              Latest cricket news, upcoming tournaments, and comprehensive coverage of the 2025 cricket season
            </p>
            <div className="flex items-center justify-center space-x-4 text-red-100">
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
              🚨 Champions Trophy 2025: India squad announced with Rohit as captain
            </span>
            <span className="px-8 text-sm">
              🏏 IPL 2025 Mega Auction: Record ₹27 crore bid breaks all previous records
            </span>
            <span className="px-8 text-sm">
              🎯 Ashes 2025: Complete schedule released, series starts November at Gabba
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-red-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search 2025 cricket news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-red-100">
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
                            <span className="ml-1 capitalize">{article.category.replace('-', ' ')}</span>
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
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
                  <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-red-100">
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
                            <span className="ml-1 capitalize">{article.category.replace('-', ' ')}</span>
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
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
                              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Bookmark className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Live Updates 2025</h3>
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveUpdates.map((update) => (
                  <div key={update.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">📰</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{update.text}</p>
                        <span className="text-xs text-gray-500">{formatTimeAgo(update.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Stay Updated with 2025 Cricket</h3>
              <p className="text-red-100 text-sm mb-4">Get the latest cricket news and tournament updates delivered to your inbox</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors">
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