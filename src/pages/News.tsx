import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Globe, Search, Filter, Eye, MessageCircle, Share2, Bookmark, Play, Zap, Bell, Rss, ExternalLink, Star, Siren as Fire, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { newsService, ExternalNewsArticle, LiveNewsUpdate } from '../services/newsService';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'breaking' | 'match-report' | 'transfer' | 'analysis' | 'interview' | 'stats' | 'upcoming' | 'live-update';
  timestamp: string;
  author: string;
  image: string;
  views: number;
  comments: number;
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  isLive?: boolean;
  source?: string;
  readTime?: number;
  priority?: 'high' | 'medium' | 'low';
  url?: string;
}

interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<LiveNewsUpdate[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  // Convert external article to internal format
  const convertExternalArticle = (externalArticle: ExternalNewsArticle): NewsArticle => {
    const now = new Date();
    const publishedDate = new Date(externalArticle.publishedAt);
    const hoursAgo = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    // Determine category based on content
    let category: NewsArticle['category'] = 'match-report';
    const title = externalArticle.title.toLowerCase();
    
    if (title.includes('breaking') || title.includes('urgent') || hoursAgo < 1) {
      category = 'breaking';
    } else if (title.includes('live') || title.includes('score')) {
      category = 'live-update';
    } else if (title.includes('transfer') || title.includes('signs') || title.includes('contract')) {
      category = 'transfer';
    } else if (title.includes('analysis') || title.includes('review')) {
      category = 'analysis';
    } else if (title.includes('interview') || title.includes('speaks')) {
      category = 'interview';
    } else if (title.includes('stats') || title.includes('record')) {
      category = 'stats';
    } else if (title.includes('upcoming') || title.includes('schedule')) {
      category = 'upcoming';
    }

    return {
      id: externalArticle.id,
      title: externalArticle.title,
      summary: externalArticle.description || externalArticle.content.substring(0, 200) + '...',
      content: externalArticle.content,
      category,
      timestamp: externalArticle.publishedAt,
      author: externalArticle.author || 'Sports Reporter',
      image: externalArticle.urlToImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
      views: Math.floor(Math.random() * 10000) + 100,
      comments: Math.floor(Math.random() * 200) + 5,
      tags: [externalArticle.source.name, 'Cricket', '2025'],
      isBreaking: category === 'breaking' || hoursAgo < 2,
      isFeatured: Math.random() > 0.7,
      isLive: category === 'live-update',
      source: externalArticle.source.name,
      readTime: Math.ceil(externalArticle.content.length / 200),
      priority: category === 'breaking' ? 'high' : hoursAgo < 6 ? 'medium' : 'low',
      url: externalArticle.url
    };
  };

  // Fetch real news data
  const fetchRealNews = async () => {
    if (!isOnline) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newsData = await newsService.fetchAllNews();
      
      // Convert external articles to internal format
      const convertedArticles = newsData.articles.map(convertExternalArticle);
      
      setArticles(convertedArticles);
      setLiveUpdates(newsData.liveUpdates);
      setTrendingTopics(newsData.trending);
      setLastUpdateTime(new Date());
      
      console.log('Fetched real news:', {
        articles: convertedArticles.length,
        liveUpdates: newsData.liveUpdates.length,
        trending: newsData.trending.length
      });
    } catch (error) {
      console.error('Error fetching real news:', error);
      setError('Failed to fetch latest news. Please try again later.');
      
      // Fallback to sample data if API fails
      loadFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data when API fails
  const loadFallbackData = () => {
    const fallbackArticles: NewsArticle[] = [
      {
        id: 'fallback-1',
        title: 'IPL 2025 Mega Auction: Record-Breaking Bids Expected',
        summary: 'The upcoming IPL 2025 mega auction is set to witness unprecedented bidding wars with several marquee players in the fray.',
        content: 'The IPL 2025 mega auction is generating massive excitement among cricket fans and franchise owners alike...',
        category: 'breaking',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        author: 'Cricket Reporter',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
        views: 15420,
        comments: 234,
        tags: ['IPL', 'Auction', '2025'],
        isBreaking: true,
        isFeatured: true,
        source: 'SportHub24',
        readTime: 3,
        priority: 'high'
      },
      {
        id: 'fallback-2',
        title: 'Champions Trophy 2025: Squad Announcements Begin',
        summary: 'Cricket boards around the world are starting to announce their squads for the upcoming Champions Trophy 2025.',
        content: 'With the Champions Trophy 2025 approaching, cricket boards are finalizing their squads...',
        category: 'upcoming',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: 'Sports Correspondent',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop',
        views: 8930,
        comments: 156,
        tags: ['Champions Trophy', '2025', 'Squad'],
        isFeatured: true,
        source: 'Cricket News',
        readTime: 4,
        priority: 'medium'
      }
    ];

    setArticles(fallbackArticles);
    setLiveUpdates([
      {
        id: 'fallback-update-1',
        text: 'LIVE: India vs Australia - Day 1 of Test match underway',
        timestamp: new Date().toISOString(),
        type: 'score',
        priority: 'high',
        source: 'Live Coverage'
      }
    ]);
    setTrendingTopics([
      { id: 'trend-1', name: 'IPL 2025', count: 25000, trend: 'up' },
      { id: 'trend-2', name: 'Champions Trophy', count: 18000, trend: 'up' },
      { id: 'trend-3', name: 'Cricket News', count: 12000, trend: 'stable' }
    ]);
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      if (isLiveMode) {
        fetchRealNews();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setError('You are currently offline. Some features may not work properly.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isLiveMode]);

  // Initial data load
  useEffect(() => {
    fetchRealNews();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!isLiveMode || !isOnline) return;

    const interval = setInterval(() => {
      // Fetch fresh news every 5 minutes
      const timeSinceLastUpdate = Date.now() - lastUpdateTime.getTime();
      if (timeSinceLastUpdate > 5 * 60 * 1000) { // 5 minutes
        fetchRealNews();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isLiveMode, isOnline, lastUpdateTime, fetchRealNews]);

  // Filter articles
  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

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
      case 'live-update': return 'bg-red-200 text-red-800 border-red-300';
      case 'match-report': return 'bg-red-100 text-red-700 border-red-200';
      case 'transfer': return 'bg-red-200 text-red-800 border-red-300';
      case 'analysis': return 'bg-red-100 text-red-700 border-red-200';
      case 'interview': return 'bg-red-200 text-red-800 border-red-300';
      case 'stats': return 'bg-red-100 text-red-700 border-red-200';
      case 'upcoming': return 'bg-red-200 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return <Fire className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All News', count: articles.length },
    { id: 'breaking', label: 'Breaking', count: articles.filter(a => a.category === 'breaking').length },
    { id: 'live-update', label: 'Live Updates', count: articles.filter(a => a.category === 'live-update').length },
    { id: 'upcoming', label: 'Upcoming', count: articles.filter(a => a.category === 'upcoming').length },
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
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mr-4">
                <Rss className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Live Cricket News Hub</h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-8">
              Real-time cricket news from ESPN Cricinfo, Cricbuzz, and other trusted sources
            </p>
            <div className="flex items-center justify-center space-x-6 text-red-100">
              <div className="flex items-center">
                {isOnline ? (
                  <>
                    <Wifi className="h-5 w-5 mr-2" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-5 w-5 mr-2" />
                    <span>Offline</span>
                  </>
                )}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Last updated: {formatTimeAgo(lastUpdateTime.toISOString())}</span>
              </div>
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                <span>{articles.length} live stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Status Bar */}
      <section className="bg-red-600 text-white py-3 overflow-hidden">
        <div className="flex items-center">
          <div className="bg-red-800 px-4 py-2 font-bold text-sm whitespace-nowrap flex items-center">
            <Zap className="h-4 w-4 mr-2 animate-pulse" />
            LIVE NEWS FROM REAL SOURCES
          </div>
          <div className="flex animate-scroll">
                {liveUpdates.slice(0, 5).map((update) => (
                  <span key={update.id} className="px-8 text-sm flex items-center">
                    🚨 {update.text}
                  </span>
                ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
                <button
                  onClick={fetchRealNews}
                  className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Live Mode Toggle & Search */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-red-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLiveMode(!isLiveMode)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isLiveMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    {isLiveMode ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        Live Mode ON
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Enable Live Mode
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={fetchRealNews}
                    disabled={isLoading || !isOnline}
                    className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Updating...' : 'Refresh News'}
                  </button>

                  {articles.length > 0 && (
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      {articles.length} articles loaded
                    </div>
                  )}
                </div>

                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search real cricket news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      {category.label} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && articles.length === 0 && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Fetching latest cricket news from real sources...</p>
              </div>
            )}

            {/* Breaking News Banner */}
            {articles.filter(a => a.isBreaking).length > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl mb-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-6 w-6 mr-2 animate-pulse" />
                  <h2 className="text-xl font-bold">Breaking News</h2>
                </div>
                <div className="space-y-3">
                  {articles.filter(a => a.isBreaking).slice(0, 2).map((article) => (
                    <div key={article.id} className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <div className="flex items-center text-red-100 text-sm">
                          <span>{formatTimeAgo(article.timestamp)}</span>
                          <span className="mx-2">•</span>
                          <span>{article.source}</span>
                        </div>
                      </div>
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Articles */}
            {filteredArticles.filter(article => article.isFeatured).length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-red-600" />
                  Featured Stories from Real Sources
                </h2>
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
                            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                              BREAKING
                            </span>
                          )}
                          {article.isLive && (
                            <span className="bg-red-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                              LIVE
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                            {article.category.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          {getPriorityIcon(article.priority)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <span>{article.author}</span>
                            <span>{formatTimeAgo(article.timestamp)}</span>
                            <span>{article.readTime} min read</span>
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
                        {article.url && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Read Full Article
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-6 w-6 mr-2 text-red-600" />
                Latest Cricket News from Real Sources
                {isLiveMode && isOnline && (
                  <div className="ml-3 flex items-center text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">Live Updates</span>
                  </div>
                )}
              </h2>
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {article.isBreaking && (
                              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                                BREAKING
                              </span>
                            )}
                            {article.isLive && (
                              <span className="bg-red-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                                LIVE
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                              {article.category.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          {getPriorityIcon(article.priority)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{article.summary}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{article.author}</span>
                            <span>{formatTimeAgo(article.timestamp)}</span>
                            <span>{article.readTime} min read</span>
                            <span className="text-red-600 font-medium">{article.source}</span>
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
                              {article.url && (
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        {article.url && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Read Full Article
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredArticles.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Globe className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria, or refresh to get the latest news.</p>
                  <button
                    onClick={fetchRealNews}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Refresh News
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connection Status */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Connection Status</h3>
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-600" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className={`text-sm ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                {isOnline ? 'Connected to live news sources' : 'Offline - showing cached content'}
              </p>
            </div>

            {/* Live Updates */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-red-600" />
                  Live Updates
                </h3>
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveUpdates.map((update) => (
                  <div key={update.id} className={`border-l-4 pl-4 py-2 ${
                    update.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-red-300'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-1">
                        {update.type === 'wicket' && <span className="text-lg">🏏</span>}
                        {update.type === 'boundary' && <span className="text-lg">🎯</span>}
                        {update.type === 'score' && <span className="text-lg">📊</span>}
                        {update.type === 'milestone' && <span className="text-lg">🏆</span>}
                        {update.type === 'news' && <span className="text-lg">📰</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{update.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{formatTimeAgo(update.timestamp)}</span>
                          <span className="text-xs text-red-600">{update.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {liveUpdates.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No live updates available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                Trending Now
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, _index) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-red-600">#{_index + 1}</span>
                      <div>
                        <div className="font-medium text-gray-900">{topic.name}</div>
                        <div className="text-xs text-gray-500">{topic.count.toLocaleString()} mentions</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {topic.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {topic.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                      {topic.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full"></div>}
                    </div>
                  </div>
                ))}
                {trendingTopics.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No trending topics available</p>
                  </div>
                )}
              </div>
            </div>

            {/* News Sources */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">News Sources</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ESPN Cricinfo</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cricbuzz</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">NDTV Sports</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Times of India</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Live News Alerts
              </h3>
              <p className="text-red-100 text-sm mb-4">Get instant notifications for breaking cricket news from real sources</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Live Alerts
                </button>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Live Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Articles Today</span>
                  <span className="font-bold text-red-600">{articles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Live Updates</span>
                  <span className="font-bold text-red-600">{liveUpdates.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Breaking News</span>
                  <span className="font-bold text-red-600">{articles.filter(a => a.isBreaking).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-bold text-red-600">{articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <span className="font-bold text-red-600">{formatTimeAgo(lastUpdateTime.toISOString())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;