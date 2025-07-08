// API Keys Configuration
// IMPORTANT: Replace these with your actual API keys

export const API_KEYS = {
  NEWS_API: "f084fe8cb6b54e11aae0ebc1d16fa7d1",
  CRIC_API: "bfecbc48a4msh913efee7767e2f5p112c8ajsn92267a472dad",
  RAPID_API: "bfecbc48a4msh913efee7767e2f5p112c8ajsn92267a472dad",
  SPORTS_DATA: "bfecbc48a4msh913efee7767e2f5p112c8ajsn92267a472dad",
} as const;


// API Endpoints
export const API_ENDPOINTS = {
  NEWS_API: "https://newsapi.org/v2/everything",
  CRIC_API: "https://api.cricapi.com/v1",
  ESPN_CRICKET: "https://site.web.api.espn.com/apis/site/v2/sports/cricket",
  CRICBUZZ: "https://cricbuzz-cricket.p.rapidapi.com",
  SPORTS_DATA: "https://api.sportsdata.io/v3/cricket",
  CRICBUZZ_RECENT: "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent",
};

// RSS Feed URLs (No API key required)
export const RSS_FEEDS = [
  "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
  "https://www.cricbuzz.com/rss-feed/cricket-news",
  "https://feeds.feedburner.com/ndtvsports-cricket",
  "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
  "https://indianexpress.com/section/sports/cricket/feed/",
  "https://www.hindustantimes.com/feeds/rss/cricket/rssfeed.xml",
];

// CORS Proxy URLs (for accessing RSS feeds from browser)
export const CORS_PROXIES = [
  "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent",
  "https://cricket-api-free-data.p.rapidapi.com/cricket-players?teamid=2",
  "https://cricket-news-api1.p.rapidapi.com/posts/?page=1&per_page=10&order=desc&orderby=date",
  "https://api.codetabs.com/v1/proxy?quest=",
];
