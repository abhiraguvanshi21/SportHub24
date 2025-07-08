import { API_KEYS, API_ENDPOINTS, RSS_FEEDS } from '../utils/apiConfig';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  category: string;
}

export interface ExternalNewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author: string;
  category: string;
}

export interface LiveNewsUpdate {
  id: string;
  text: string;
  timestamp: string;
  type: 'score' | 'wicket' | 'boundary' | 'milestone' | 'news' | 'breaking';
  priority: 'high' | 'medium' | 'low';
  source: string;
  match?: string;
}

class NewsService {
  private readonly CORS_PROXY = 'https://api.allorigins.win/raw?url=';

  async fetchFromNewsAPI(query: string = 'cricket'): Promise<ExternalNewsArticle[]> {
    try {
      const url = `${API_ENDPOINTS.NEWS_API}?q=${query}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEYS.NEWS_API}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        return data.articles.map((article: { title: string; description?: string; content?: string; url: string; urlToImage?: string; publishedAt: string; source?: { name?: string }; author?: string }) => ({
          id: `newsapi-${Date.now()}-${Math.random()}`,
          title: article.title,
          description: article.description || '',
          content: article.content || article.description || '',
          url: article.url,
          urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
          publishedAt: article.publishedAt,
          source: {
            id: 'newsapi',
            name: article.source?.name || 'NewsAPI'
          },
          author: article.author || 'Sports Reporter',
          category: 'cricket'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      return [];
    }
  }

  async fetchFromRSSFeeds(): Promise<ExternalNewsArticle[]> {
    const articles: ExternalNewsArticle[] = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const proxyUrl = `${this.CORS_PROXY}${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');

        items.forEach((item, index) => {
          const title = item.querySelector('title')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
          const author = item.querySelector('author')?.textContent || 'Cricket Reporter';

          if (title && description) {
            articles.push({
              id: `rss-${feedUrl.split('/')[2]}-${index}-${Date.now()}`,
              title: this.cleanHtml(title),
              description: this.cleanHtml(description),
              content: this.cleanHtml(description),
              url: link,
              urlToImage: this.extractImageFromDescription(description) || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
              publishedAt: new Date(pubDate).toISOString(),
              source: {
                id: feedUrl.split('/')[2],
                name: this.getSourceName(feedUrl)
              },
              author: this.cleanHtml(author),
              category: 'cricket'
            });
          }
        });
      } catch (error) {
        console.error(`Error fetching RSS feed ${feedUrl}:`, error);
      }
    }

    return articles.slice(0, 30);
  }

  async fetchRecentMatchesFromCricbuzz(): Promise<LiveNewsUpdate[]> {
    try {
      const response = await fetch(API_ENDPOINTS.CRICBUZZ_RECENT, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEYS.RAPID_API,
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
      });

      const data = await response.json();
      const updates: LiveNewsUpdate[] = [];

      if (data && Array.isArray(data.typeMatches)) {
        for (const typeMatch of data.typeMatches) {
          for (const seriesMatch of typeMatch.seriesMatches || []) {
            const match = seriesMatch.matchInfo;
            if (!match) continue;

            updates.push({
              id: `cricbuzz-${match.matchId}-${Date.now()}`,
              text: `${match.team1?.teamName || 'Team A'} vs ${match.team2?.teamName || 'Team B'} - ${match.status || 'In Progress'}`,
              timestamp: new Date().toISOString(),
              type: 'news',
              priority: 'medium',
              source: 'Cricbuzz',
              match: `${match.team1?.teamName || 'Team A'} vs ${match.team2?.teamName || 'Team B'}`
            });
          }
        }
      }

      return updates;
    } catch (error) {
      console.error('Error fetching Cricbuzz recent matches:', error);
      return [];
    }
  }

  async fetchTrendingTopics(): Promise<Array<{ id: string; name: string; count: number; trend: 'up' | 'down' | 'stable' }>> {
    try {
      const topics = [
        'IPL 2025', 'Champions Trophy', 'Virat Kohli', 'T20 World Cup',
        'India vs Australia', 'Cricket Records', 'Player Transfers', 'Match Highlights',
        'Live Scores', 'Team Rankings', 'Player Stats', 'Cricket News'
      ];

      return topics.map(topic => ({
        id: `trend-${topic.replace(/\s+/g, '-').toLowerCase()}`,
        name: topic,
        count: Math.floor(Math.random() * 50000) + 5000,
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
      }));
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  }

  async fetchAllNews(): Promise<{
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: Array<{ id: string; name: string; count: number; trend: 'up' | 'down' | 'stable' }>;
  }> {
    try {
      const [newsApiArticles, rssArticles, cricbuzzUpdates, trending] = await Promise.all([
        this.fetchFromNewsAPI('cricket OR IPL OR "T20 World Cup" OR "Champions Trophy"'),
        this.fetchFromRSSFeeds(),
        this.fetchRecentMatchesFromCricbuzz(),
        this.fetchTrendingTopics()
      ]);

      const allArticles = [...newsApiArticles, ...rssArticles];
      const uniqueArticles = this.deduplicateArticles(allArticles);
      uniqueArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return {
        articles: uniqueArticles.slice(0, 50),
        liveUpdates: cricbuzzUpdates.slice(0, 20),
        trending: trending.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching all news:', error);
      return {
        articles: [],
        liveUpdates: [],
        trending: []
      };
    }
  }

  private cleanHtml(text: string): string {
    return text.replace(/<[^>]*>/g, '').trim();
  }

  private extractImageFromDescription(description: string): string | null {
    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  }

  private getSourceName(feedUrl: string): string {
    if (feedUrl.includes('espncricinfo')) return 'ESPN Cricinfo';
    if (feedUrl.includes('cricbuzz')) return 'Cricbuzz';
    if (feedUrl.includes('ndtv')) return 'NDTV Sports';
    if (feedUrl.includes('timesofindia')) return 'Times of India';
    return 'Cricket News';
  }

  private deduplicateArticles(articles: ExternalNewsArticle[]): ExternalNewsArticle[] {
    const seen = new Set();
    return articles.filter(article => {
      const key = article.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

export const newsService = new NewsService();
