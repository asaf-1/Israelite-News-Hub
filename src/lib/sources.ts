export interface FeedSource {
  name: string;
  url: string;
  category: string;
  color: string;
}

export const FEED_SOURCES: FeedSource[] = [
  // ── BREAKING ─────────────────────────────────────
  {
    name: "Jerusalem Post",
    url: "https://www.jpost.com/rss/rssfeedsnewsflashes.aspx",
    category: "breaking",
    color: "#1E5799",
  },
  {
    name: "Jerusalem Post",
    url: "https://www.jpost.com/rss/rssfeedsfullnewsflashes.aspx",
    category: "breaking",
    color: "#1E5799",
  },
  {
    name: "Times of Israel",
    url: "https://www.timesofisrael.com/feed/",
    category: "breaking",
    color: "#C0392B",
  },
  {
    name: "i24 News",
    url: "https://www.i24news.tv/en/rss",
    category: "breaking",
    color: "#E74C3C",
  },
  {
    name: "Ynet News",
    url: "https://www.ynetnews.com/category/3082",
    category: "breaking",
    color: "#E67E22",
  },
  {
    name: "Reuters World",
    url: "https://feeds.reuters.com/reuters/worldNews",
    category: "breaking",
    color: "#FF8000",
  },
  {
    name: "AP News",
    url: "https://rsshub.app/apnews/topics/apf-intlnews",
    category: "breaking",
    color: "#d4213d",
  },

  // ── POLITICS ──────────────────────────────────────
  {
    name: "Haaretz",
    url: "https://www.haaretz.com/cmlink/1.628765",
    category: "politics",
    color: "#1A3A5C",
  },
  {
    name: "Israel Hayom",
    url: "https://www.israelhayom.com/feed/",
    category: "politics",
    color: "#0038B8",
  },
  {
    name: "The Forward",
    url: "https://forward.com/feed/",
    category: "politics",
    color: "#8B0000",
  },
  {
    name: "Tablet Magazine",
    url: "https://www.tabletmag.com/rss.xml",
    category: "politics",
    color: "#6366f1",
  },

  // ── SECURITY ─────────────────────────────────────
  {
    name: "Arutz Sheva",
    url: "https://www.israelnationalnews.com/rss.aspx",
    category: "security",
    color: "#6C3483",
  },
  {
    name: "Jerusalem Post – Defense",
    url: "https://www.jpost.com/arab-israeli-conflict/rss",
    category: "security",
    color: "#1E5799",
  },
  {
    name: "Jerusalem Post",
    url: "https://www.jpost.com/israel-news/rss",
    category: "security",
    color: "#2874A6",
  },
  {
    name: "DEBKAfile",
    url: "https://www.debka.com/feed/",
    category: "security",
    color: "#922B21",
  },
  {
    name: "Israel Defense",
    url: "https://www.israeldefense.co.il/en/rss.xml",
    category: "security",
    color: "#1B4332",
  },

  // ── WORLD ─────────────────────────────────────────
  {
    name: "JTA",
    url: "https://www.jta.org/feed",
    category: "world",
    color: "#2E86AB",
  },
  {
    name: "Middle East Eye",
    url: "https://www.middleeasteye.net/rss",
    category: "world",
    color: "#27AE60",
  },
  {
    name: "Al-Monitor",
    url: "https://www.al-monitor.com/rss.xml",
    category: "world",
    color: "#117A65",
  },

  // ── CULTURE ───────────────────────────────────────
  {
    name: "Haaretz Culture",
    url: "https://www.haaretz.com/life/arts-and-culture/rss",
    category: "culture",
    color: "#5D6D7E",
  },
  {
    name: "Times of Israel – Culture",
    url: "https://www.timesofisrael.com/news/culture/feed/",
    category: "culture",
    color: "#A93226",
  },
];

export const CATEGORIES = [
  { slug: "breaking", label: "Breaking", icon: "🔴" },
  { slug: "politics", label: "Politics", icon: "⚖️" },
  { slug: "security", label: "Security", icon: "🛡️" },
  { slug: "world", label: "World", icon: "🌍" },
  { slug: "culture", label: "Culture", icon: "🎭" },
];

// Keywords that promote any article to security category
export const SECURITY_KEYWORDS = [
  "idf", "military", "missile", "rocket", "attack", "strike",
  "hamas", "hezbollah", "iran", "terror", "soldier", "army",
  "hostage", "base", "war", "combat", "bomb", "weapon", "defense",
  "mossad", "shin bet", "aman", "netanya", "iron dome", "air force",
];

// Keywords that promote any article to breaking category
export const BREAKING_KEYWORDS = [
  "breaking", "urgent", "alert", "just in", "latest",
  "explosion", "earthquake", "official", "ceasefire",
];

// Israel-related image seeds for unique fallback photos
export const ISRAEL_IMAGE_SEEDS = [
  "jerusalem-cityscape",
  "tel-aviv-skyline",
  "israel-flag",
  "dead-sea-landscape",
  "negev-desert",
  "masada-fortress",
  "galilee-mountains",
  "red-sea-eilat",
  "haifa-port",
  "middle-east-map",
  "mediterranean-coast",
  "olive-trees-israel",
  "old-city-jerusalem",
  "modern-architecture",
  "sunrise-middle-east",
];
