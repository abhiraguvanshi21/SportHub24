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

class NewsService {
  private readonly CORS_PROXY = "https://api.allorigins.win/raw?url=";

  // ─── Fetch from NewsAPI ───────────────────────────────
  async fetchFromNewsAPI(query = "cricket"): Promise<ExternalNewsArticle[]> {
    try {
      const url = `${API_ENDPOINTS.NEWS_API}?q=${query}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEYS.NEWS_API}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "ok" && data.articles) {
        interface NewsApiArticle {
          title: string;
          description?: string;
          content?: string;
          url: string;
          urlToImage?: string;
          publishedAt: string;
          source?: { name?: string };
          author?: string;
        }
        return data.articles.map((article: NewsApiArticle, index: number) => ({
          id: `newsapi-${Date.now()}-${index}`,
          title: article.title,
          description: article.description || "",
          content: article.content || article.description || "",
          url: article.url,
          urlToImage: article.urlToImage || this.getFallbackImage(),
          publishedAt: article.publishedAt,
          source: {
            id: "newsapi",
            name: article.source?.name || "NewsAPI",
          },
          author: article.author || "Sports Reporter",
          category: "cricket",
        }));
      }

      return [];
    } catch (error) {
      console.error("[NewsAPI ERROR]", error);
      return [];
    }
  }

  // ─── Fetch from RSS Feeds ──────────────────────────────
  async fetchFromRSSFeeds(): Promise<ExternalNewsArticle[]> {
    const articles: ExternalNewsArticle[] = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const proxyUrl = `${this.CORS_PROXY}${encodeURIComponent(feedUrl)}`;
        const xmlText = await fetch(proxyUrl).then((res) => res.text());
        const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        items.forEach((item, index) => {
          const title = item.querySelector("title")?.textContent || "";
          const description =
            item.querySelector("description")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const pubDate =
            item.querySelector("pubDate")?.textContent ||
            new Date().toISOString();
          const author =
            item.querySelector("author")?.textContent || "Cricket Reporter";

          if (title && description) {
            articles.push({
              id: `rss-${feedUrl.split("/")[2]}-${index}-${Date.now()}`,
              title: this.cleanHtml(title),
              description: this.cleanHtml(description),
              content: this.cleanHtml(description),
              url: link,
              urlToImage:
                this.extractImageFromDescription(description) ||
                this.getFallbackImage(),
              publishedAt: new Date(pubDate).toISOString(),
              source: {
                id: feedUrl.split("/")[2],
                name: this.getSourceName(feedUrl),
              },
              author: this.cleanHtml(author),
              category: "cricket",
            });
          }
        });
      } catch (error) {
        console.warn(`[RSS ERROR] ${feedUrl}`, error);
      }
    }

    return articles.slice(0, 30);
  }

  // ─── Fetch Recent Matches from Cricbuzz ───────────────
  async fetchRecentMatchesFromCricbuzz(): Promise<LiveNewsUpdate[]> {
    interface SeriesMatch {
      matchInfo?: {
        matchId: number;
        team1?: { teamName?: string };
        team2?: { teamName?: string };
        status?: string;
      };
    }

    interface TypeMatch {
      seriesMatches?: SeriesMatch[];
    }

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
          typeMatch.seriesMatches?.forEach((series: SeriesMatch) => {
            const match = series.matchInfo;
            if (!match) return;

            updates.push({
              id: `cricbuzz-${match.matchId}-${Date.now()}`,
              text: `${match.team1?.teamName || "Team A"} vs ${
                match.team2?.teamName || "Team B"
              } - ${match.status || "In Progress"}`,
              timestamp: new Date().toISOString(),
              type: "news",
              priority: "medium",
              source: "Cricbuzz",
              match: `${match.team1?.teamName || "Team A"} vs ${
                match.team2?.teamName || "Team B"
              }`,
            });
          });
        });
      }

      return updates;
    } catch (error) {
      console.error("[Cricbuzz ERROR]", error);
      return [];
    }
  }

  async fetchTrendingTopics(articles: ExternalNewsArticle[]): Promise<
    {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[]
  > {
    const cricketKeywords = new Set([
      // Players
      "kohli",
      "rohit",
      "bumrah",
      "dhoni",
      "jadeja",
      "gill",
      "rahul",
      // Teams
      "india",
      "australia",
      "england",
      "pakistan",
      "newzealand",
      "southafrica",
      "bangladesh",
      "srilanka",
      "afghanistan",
      // Tournaments
      "worldcup",
      "ipl",
      "t20",
      "odi",
      "test",
      "champions",
      "asia",
      "trophy",
      "series",
      "final",
    ]);

    const keywordMap = new Map<string, number>();

    articles.forEach((article) => {
      const text = `${article.title} ${article.description} ${
        article.tags?.join(" ") || ""
      }`.toLowerCase();
      text.split(/\s+/).forEach((word) => {
        const cleanWord = word.replace(/[^a-z]/gi, "").toLowerCase();
        if (cleanWord.length > 2 && cricketKeywords.has(cleanWord)) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });

    const sorted = [...keywordMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return sorted.map(([word, count], index) => ({
      id: `trend-${word}`,
      name: word.charAt(0).toUpperCase() + word.slice(1),
      count,
      trend: index === 0 ? "up" : Math.random() > 0.5 ? "up" : "stable",
    }));
  }

  // ─── Aggregate All News ────────────────────────────────
  async fetchAllNews(): Promise<{
    articles: ExternalNewsArticle[];
    liveUpdates: LiveNewsUpdate[];
    trending: {
      id: string;
      name: string;
      count: number;
      trend: "up" | "down" | "stable";
    }[];
  }> {
    try {
      const [newsApiArticles, rssArticles, cricbuzzUpdates] = await Promise.all(
        [
          this.fetchFromNewsAPI(
            "cricket OR IPL OR T20 World Cup OR Champions Trophy"
          ),
          this.fetchFromRSSFeeds(),
          this.fetchRecentMatchesFromCricbuzz(),
        ]
      );

      const combined = this.deduplicateArticles([
        ...newsApiArticles,
        ...rssArticles,
      ]).sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      const trending = await this.fetchTrendingTopics(combined);

      return {
        articles: combined.slice(0, 50),
        liveUpdates: cricbuzzUpdates.slice(0, 20),
        trending: trending.slice(0, 10),
      };
    } catch (error) {
      console.error("[FetchAll ERROR]", error);
      return {
        articles: [],
        liveUpdates: [],
        trending: [],
      };
    }
  }

  // ─── Helpers ───────────────────────────────────────────
  private cleanHtml(text: string): string {
    return text.replace(/<[^>]*>/g, "").trim();
  }

  private extractImageFromDescription(description: string): string | null {
    const match = description.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  }

  private getFallbackImage(): string {
    return "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop";
  }

  private getSourceName(feedUrl: string): string {
    if (feedUrl.includes("espncricinfo")) return "ESPN Cricinfo";
    if (feedUrl.includes("cricbuzz")) return "Cricbuzz";
    if (feedUrl.includes("ndtv")) return "NDTV Sports";
    if (feedUrl.includes("timesofindia")) return "Times of India";
    return "Cricket News";
  }

  private deduplicateArticles(
    articles: ExternalNewsArticle[]
  ): ExternalNewsArticle[] {
    const seen = new Set();
    return articles.filter((article) => {
      const key = article.title.toLowerCase().substring(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

export const newsService = new NewsService();
