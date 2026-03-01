import Parser from "rss-parser";
import { FEED_SOURCES, FeedSource, ISRAEL_IMAGE_SEEDS, SECURITY_KEYWORDS, BREAKING_KEYWORDS } from "./sources";

export interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  content: string; // Full HTML content for article reader
  pubDate: string;
  source: string;
  sourceColor: string;
  category: string;
  imageUrl: string;
  readingTime: number; // minutes
}

// In-memory cache per feed URL
const cache = new Map<string, { data: Article[]; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function extractImage(item: Record<string, unknown>): string | null {
  if (item.mediaContent && typeof item.mediaContent === "object") {
    const mc = item.mediaContent as Record<string, unknown>;
    if (mc.$ && typeof mc.$ === "object") {
      const attrs = mc.$ as Record<string, string>;
      if (attrs.url) return attrs.url;
    }
  }
  if (item.mediaThumbnail && typeof item.mediaThumbnail === "object") {
    const mt = item.mediaThumbnail as Record<string, unknown>;
    if (mt.$ && typeof mt.$ === "object") {
      const attrs = mt.$ as Record<string, string>;
      if (attrs.url) return attrs.url;
    }
  }
  if (item.enclosure && typeof item.enclosure === "object") {
    const enc = item.enclosure as Record<string, string>;
    if (enc.url && enc.type?.startsWith("image")) return enc.url;
  }
  const htmlContent =
    (item.contentEncoded as string) || (item.content as string) || "";
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  return null;
}

function cleanText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadingTime(text: string): number {
  const words = cleanText(text).split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function uniqueImageForArticle(title: string, globalIdx: number): string {
  // Use title hash as picsum seed for uniqueness
  const seed = encodeURIComponent(title.slice(0, 40).replace(/\s+/g, "-").toLowerCase()) +
    `-${globalIdx}`;
  return `https://picsum.photos/seed/${seed}/800/500`;
}

async function fetchFeed(source: FeedSource): Promise<Article[]> {
  const cacheKey = source.url;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) return cached.data;

  try {
    const feed = await parser.parseURL(source.url);
    const articles: Article[] = (feed.items || [])
      .slice(0, 15)
      .map((item, idx) => {
        const raw = item as unknown as Record<string, unknown>;
        const rawContent =
          (item as unknown as Record<string, string>).contentEncoded ||
          (item.content as string) || "";
        const description = cleanText(
          (item.contentSnippet as string) || (item.summary as string) || (item.content as string) || ""
        ).slice(0, 220);

        const titleAndDescLower = (item.title?.trim() + " " + description).toLowerCase();
        let finalCategory = source.category;

        // Smart categorization: Promote to breaking or security based on keywords
        if (source.category !== "breaking" && BREAKING_KEYWORDS.some(k => titleAndDescLower.includes(k))) {
          finalCategory = "breaking";
        } else if (source.category !== "security" && source.category !== "breaking" && SECURITY_KEYWORDS.some(k => titleAndDescLower.includes(k))) {
          finalCategory = "security";
        }

        return {
          id: `${source.name}-${idx}-${encodeURIComponent(item.link || "")}`,
          title: item.title?.trim() || "Untitled",
          link: item.link || "#",
          description,
          content: rawContent || `<p>${description}</p>`,
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: source.name,
          sourceColor: source.color,
          category: finalCategory,
          imageUrl: extractImage(raw) || "",
          readingTime: estimateReadingTime(rawContent || description),
        };
      });

    cache.set(cacheKey, { data: articles, expiry: Date.now() + CACHE_TTL });
    return articles;
  } catch (err) {
    console.error(`[RSS] Failed: ${source.url}`, err);
    return [];
  }
}

function deduplicateImages(articles: Article[]): Article[] {
  const seenImages = new Set<string>();
  return articles.map((article, idx) => {
    const img = article.imageUrl;
    if (!img || seenImages.has(img)) {
      // Assign a unique fallback based on title + global index
      return { ...article, imageUrl: uniqueImageForArticle(article.title, idx) };
    }
    seenImages.add(img);
    return article;
  });
}

export async function getAllArticles(): Promise<Article[]> {
  const results = await Promise.allSettled(FEED_SOURCES.map(fetchFeed));
  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") articles.push(...result.value);
  }
  // Sort newest first
  const sorted = articles.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
  // Ensure every article has a unique image
  return deduplicateImages(sorted);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.category === category);
}

export async function getArticleByLink(
  link: string,
  source: string
): Promise<Article | null> {
  const all = await getAllArticles();
  return all.find((a) => a.link === link && a.source === source) || null;
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Sanitize HTML for safe rendering in article reader
export function sanitizeHtml(html: string): string {
  // Remove scripts, styles, iframes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    // Add target blank to links
    .replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" ')
    // Make images responsive
    .replace(/<img\s/gi, '<img style="max-width:100%;height:auto;border-radius:8px;" ');
}
