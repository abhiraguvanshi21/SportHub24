import { API_KEYS, API_ENDPOINTS, RSS_FEEDS } from "../utils/apiConfig";

// ─── Interfaces ───────────────────────────────────────────────
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
  source: { id: string; name: string };
  author: string;
  category: string;
  tags?: string[];
  imageAlt?: string; // Made optional since it's derived
  readTime?: number; // Made optional since it's calculated
}

export interface LiveNewsUpdate {
  id: string;
  text: string;
  timestamp: string;
  type: "score" | "wicket" | "boundary" | "milestone" | "news" | "breaking";
  priority: "high" | "medium" | "low";
  source: string;
  match?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface SeriesMatch {
  matchInfo?: {
    matchId: string;
    team1?: { teamName: string };
    team2?: { teamName: string };
    status?: string;
  };
}

interface TypeMatch {
  seriesMatches?: SeriesMatch[];
}

interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name?: string };
  author?: string;
}

class NewsService {
  private readonly CORS_PROXY = "https://api.allorigins.win/raw?url=";
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(data: {
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[];
    lastUpdated: string;
  }) => void> = [];

  // ─── Cache Management ──────────────────────────────────
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // ─── Event Listeners for Auto-Update ──────────────────
  public addUpdateListener(callback: (data: {
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[];
    lastUpdated: string;
  }) => void): void {
    this.listeners.push(callback);
  }

  public removeUpdateListener(callback: (data: {
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[];
    lastUpdated: string;
  }) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(data: {
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[];
    lastUpdated: string;
  }): void {
    this.listeners.forEach(listener => listener(data));
  }

  // ─── Start Auto-Update ─────────────────────────────────
  public startAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Initial fetch
    this.fetchAllNews().then(data => {
      this.notifyListeners(data);
    });

    // Set up interval for every 10 minutes
    this.updateInterval = setInterval(async () => {
      try {
        console.log('🔄 Auto-updating news...');
        const data = await this.fetchAllNews();
        this.notifyListeners(data);
        console.log('✅ News updated successfully');
      } catch (error) {
        console.error('❌ Auto-update failed:', error instanceof Error ? error.message : String(error));
      }
    }, this.CACHE_DURATION);
  }

  public stopAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // ─── Image Processing Methods ─────────────────────────
  private extractImageFromDescription(description: string): string | null {
    const patterns = [
      /<img[^>]+src="([^">]+)"/i,
      /<img[^>]+src='([^'>]+)'/i,
      /src="([^"]*\.(jpg|jpeg|png|gif|webp)[^"]*)"/i,
      /src='([^']*\.(jpg|jpeg|png|gif|webp)[^']*)'/i,
      /https?:\/\/[^\s<>"']*\.(jpg|jpeg|png|gif|webp)/i
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  private async validateAndProcessImage(imageUrl: string, title: string, description?: string): Promise<string> {
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
      return this.getCricketFallbackImage(title, description);
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(imageUrl, { 
        method: 'HEAD',
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        return imageUrl;
      }
    } catch (error: unknown) {
      console.warn(`Image validation failed for ${imageUrl}:`, error instanceof Error ? error.message : String(error));
    }

    return this.getCricketFallbackImage(title, description);
  }

  private getCricketFallbackImage(title?: string, description?: string): string {
    const text = `${title || ''} ${description || ''}`.toLowerCase();
    
    const cricketImages = [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop&auto=format&q=80',
      'https://th.bing.com/th?id=ORMS.b9ed55836be51722d02bd5778cf16162&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.25&p=0',
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop&auto=format&q=80',
    ];

    const specificImages: Record<string, string> = {
      ipl: 'https://th.bing.com/th/id/OIP.X4gtBNS6gqAT0VG00x8uXAHaEK?w=322&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      t20: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop&auto=format&q=80',
      worldcup: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop&auto=format&q=80',
      kohli: 'https://th.bing.com/th/id/OIP.jLVf0jSATd6dqxG1fJwMnAHaEK?w=320&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      india: 'https://th.bing.com/th/id/OIP.xwnUhm4XxNl0oInMtbjnqQHaHW?w=169&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    };

    for (const [keyword, imageUrl] of Object.entries(specificImages)) {
      if (text.includes(keyword)) {
        return imageUrl;
      }
    }

    return cricketImages[Math.floor(Math.random() * cricketImages.length)];
  }

  // ─── News API Fetch Methods ────────────────────────────
  async fetchFromNewsAPI(query = "cricket"): Promise<ExternalNewsArticle[]> {
    const cacheKey = `newsapi-${query}`;
    const cached = this.getCachedData<ExternalNewsArticle[]>(cacheKey);
    if (cached) return cached;

    try {
      const url = `${API_ENDPOINTS.NEWS_API}?q=${query}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${API_KEYS.NEWS_API}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "ok" && data.articles) {
        const articles = await Promise.all(
          data.articles.map(async (article: NewsApiArticle, index: number) => {
            const processedImage = await this.validateAndProcessImage(
              article.urlToImage,
              article.title,
              article.description
            );

            return {
              id: `newsapi-${Date.now()}-${index}`,
              title: article.title,
              description: article.description || "",
              content: article.content || article.description || "",
              url: article.url,
              urlToImage: processedImage,
              publishedAt: article.publishedAt,
              source: {
                id: "newsapi",
                name: article.source?.name || "NewsAPI",
              },
              author: article.author || "Sports Reporter",
              category: "cricket",
              imageAlt: `Cricket news: ${article.title}`,
              readTime: this.calculateReadTime(article.content || article.description || ""),
              tags: this.extractTags(article.title + " " + (article.description || "")),
            };
          })
        );

        this.setCachedData(cacheKey, articles);
        return articles;
      }

      return [];
    } catch (error) {
      console.error("[NewsAPI ERROR]", error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  // ─── RSS Feed Fetch Methods ────────────────────────────
  async fetchFromRSSFeeds(): Promise<ExternalNewsArticle[]> {
    const cacheKey = 'rss-feeds';
    const cached = this.getCachedData<ExternalNewsArticle[]>(cacheKey);
    if (cached) return cached;

    const articles: ExternalNewsArticle[] = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const proxyUrl = `${this.CORS_PROXY}${encodeURIComponent(feedUrl)}`;
        const xmlText = await fetch(proxyUrl).then((res) => res.text());
        const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

      // In the fetchFromRSSFeeds method, replace the feedArticles processing with:

const feedArticles = await Promise.all(
  Array.from(items).slice(0, 10).map(async (item, index) => {
    const title = item.querySelector("title")?.textContent || "";
    const description = item.querySelector("description")?.textContent || "";
    const link = item.querySelector("link")?.textContent || "";
    const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
    const author = item.querySelector("author")?.textContent || "Cricket Reporter";

    if (!title || !description) {
      return null;
    }

    const extractedImage = this.extractImageFromDescription(description);
    const processedImage = await this.validateAndProcessImage(
      extractedImage || "",
      title,
      description
    );

    // Create a properly typed article object
    const article: ExternalNewsArticle = {
      id: `rss-${feedUrl.split("/")[2]}-${index}-${Date.now()}`,
      title: this.cleanHtml(title),
      description: this.cleanHtml(description),
      content: this.cleanHtml(description),
      url: link,
      urlToImage: processedImage,
      publishedAt: new Date(pubDate).toISOString(),
      source: {
        id: feedUrl.split("/")[2],
        name: this.getSourceName(feedUrl),
      },
      author: this.cleanHtml(author),
      category: "cricket",
      imageAlt: `Cricket news from ${this.getSourceName(feedUrl)}: ${title}`,
      readTime: this.calculateReadTime(description),
      tags: this.extractTags(title + " " + description),
    };
    return article;
  })
);

// Filter out null values with proper type guard
articles.push(...feedArticles.filter((article): article is ExternalNewsArticle => article !== null));
      } catch (error) {
        console.warn(`[RSS ERROR] ${feedUrl}`, error instanceof Error ? error.message : String(error));
      }
    }

    const result = articles.slice(0, 30);
    this.setCachedData(cacheKey, result);
    return result;
  }

  // ─── Cricbuzz Fetch Methods ────────────────────────────
  async fetchRecentMatchesFromCricbuzz(): Promise<LiveNewsUpdate[]> {
    const cacheKey = 'cricbuzz-matches';
    const cached = this.getCachedData<LiveNewsUpdate[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(API_ENDPOINTS.CRICBUZZ_RECENT, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEYS.RAPID_API,
          "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
        },
      });

      const data = await response.json();
      const updates: LiveNewsUpdate[] = [];

      if (data?.typeMatches?.length) {
        data.typeMatches.forEach((typeMatch: TypeMatch) => {
          typeMatch.seriesMatches?.forEach((series) => {
            const match = series.matchInfo;
            if (!match) return;

            const isLive = match.status?.toLowerCase().includes('live') || 
                          match.status?.toLowerCase().includes('progress');

            updates.push({
              id: `cricbuzz-${match.matchId}-${Date.now()}`,
              text: `🏏 ${match.team1?.teamName || "Team A"} vs ${
                match.team2?.teamName || "Team B"
              } - ${match.status || "In Progress"}`,
              timestamp: new Date().toISOString(),
              type: isLive ? "score" : "news",
              priority: isLive ? "high" : "medium",
              source: "Cricbuzz Live",
              match: `${match.team1?.teamName || "Team A"} vs ${
                match.team2?.teamName || "Team B"
              }`,
            });
          });
        });
      }

      this.setCachedData(cacheKey, updates);
      return updates;
    } catch (error) {
      console.error("[Cricbuzz ERROR]", error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  // ─── Trending Topics Methods ───────────────────────────
  async fetchTrendingTopics(articles: ExternalNewsArticle[]): Promise<
    {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[]
  > {
    const cricketKeywords = new Map([
      ["kohli", "Virat Kohli"],
      ["rohit", "Rohit Sharma"],
      ["bumrah", "Jasprit Bumrah"],
      ["dhoni", "MS Dhoni"],
      ["jadeja", "Ravindra Jadeja"],
      ["gill", "Shubman Gill"],
      ["rahul", "KL Rahul"],
      ["india", "Team India"],
      ["australia", "Australia"],
      ["england", "England"],
      ["pakistan", "Pakistan"],
      ["worldcup", "World Cup"],
      ["ipl", "IPL"],
      ["t20", "T20 Cricket"],
      ["odi", "ODI Cricket"],
      ["test", "Test Cricket"],
      ["champions", "Champions Trophy"],
    ]);

    const keywordCount = new Map<string, number>();

    articles.forEach((article) => {
      const text = `${article.title} ${article.description} ${
        article.tags?.join(" ") || ""
      }`.toLowerCase();
      
      cricketKeywords.forEach((displayName, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          keywordCount.set(displayName, (keywordCount.get(displayName) || 0) + matches.length);
        }
      });
    });

    const sorted = [...keywordCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return sorted.map(([name, count], index) => ({
      id: `trend-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      count,
      trend: index < 3 ? "up" : index < 6 ? "stable" : "down",
    }));
  }

  // ─── Main Fetch Method ─────────────────────────────────
  async fetchAllNews(): Promise<{
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[];
    lastUpdated: string;
  }> {
    try {
      console.log('📰 Fetching latest cricket news with images...');
      
      const [newsApiArticles, rssArticles, cricbuzzUpdates] = await Promise.all([
        this.fetchFromNewsAPI("cricket OR IPL OR T20 World Cup OR Champions Trophy OR India cricket"),
        this.fetchFromRSSFeeds(),
        this.fetchRecentMatchesFromCricbuzz(),
      ]);

      const combined = this.deduplicateArticles([
        ...newsApiArticles,
        ...rssArticles,
      ]).sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      const trending = await this.fetchTrendingTopics(combined);

      console.log(`✅ Fetched ${combined.length} articles with images`);

      return {
        articles: combined.slice(0, 50),
        liveUpdates: cricbuzzUpdates.slice(0, 20),
        trending: trending.slice(0, 10),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[FetchAll ERROR]", error instanceof Error ? error.message : String(error));
      return {
        articles: [],
        liveUpdates: [],
        trending: [],
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // ─── Helper Methods ────────────────────────────────────
  private cleanHtml(text: string): string {
    return text.replace(/<[^>]*>/g, "").trim();
  }

  private getSourceName(feedUrl: string): string {
    if (feedUrl.includes("espncricinfo")) return "ESPN Cricinfo";
    if (feedUrl.includes("cricbuzz")) return "Cricbuzz";
    if (feedUrl.includes("ndtv")) return "NDTV Sports";
    if (feedUrl.includes("timesofindia")) return "Times of India";
    if (feedUrl.includes("indianexpress")) return "Indian Express";
    if (feedUrl.includes("hindustantimes")) return "Hindustan Times";
    return "Cricket News";
  }

  private deduplicateArticles(articles: ExternalNewsArticle[]): ExternalNewsArticle[] {
    const seen = new Set();
    return articles.filter((article) => {
      const key = article.title.toLowerCase().substring(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private extractTags(text: string): string[] {
    const commonTags = [
      'IPL', 'T20', 'ODI', 'Test', 'World Cup', 'Champions Trophy',
      'India', 'Australia', 'England', 'Pakistan', 'Cricket',
      'Kohli', 'Rohit', 'Dhoni', 'Bumrah', 'Match', 'Series'
    ];

    return commonTags.filter(tag => 
      text.toLowerCase().includes(tag.toLowerCase())
    ).slice(0, 5);
  }

  // ─── Cleanup ───────────────────────────────────────────
  public destroy(): void {
    this.stopAutoUpdate();
    this.cache.clear();
    this.listeners = [];
  }
}

export const newsService = new NewsService();