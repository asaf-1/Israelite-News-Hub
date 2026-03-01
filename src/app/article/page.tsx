import { getArticleByLink, getAllArticles, getRelativeTime, sanitizeHtml } from "@/lib/rss";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, ExternalLink, Share2 } from "lucide-react";
import NewsImage from "@/components/NewsImage";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ link?: string; source?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { link, source } = await searchParams;
  if (!link || !source) return { title: "Article – Israelite News Hub" };
  const article = await getArticleByLink(
    decodeURIComponent(link),
    decodeURIComponent(source)
  );
  if (!article) return { title: "Article – Israelite News Hub" };
  return {
    title: `${article.title} – Israelite News Hub`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ searchParams }: Props) {
  const { link, source } = await searchParams;
  if (!link || !source) notFound();

  const decodedLink = decodeURIComponent(link);
  const decodedSource = decodeURIComponent(source);

  const article = await getArticleByLink(decodedLink, decodedSource);
  if (!article) notFound();

  // Get related articles from the same source
  const allArticles = await getAllArticles();
  const related = allArticles
    .filter((a) => a.source === article.source && a.link !== article.link)
    .slice(0, 5);

  const hasRichContent = article.content && article.content.length > 200 && article.content.includes("<");

  const pubDate = new Date(article.pubDate);
  const formattedDate = isNaN(pubDate.getTime())
    ? "Recently"
    : pubDate.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });

  return (
    <div className="article-page">
      {/* Back button */}
      <Link href="/" className="article-back">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className="article-layout">
        {/* Main content */}
        <article className="article-main float-in">
          {/* Eyebrow */}
          <div className="article-eyebrow">
            <span
              className="article-source-badge"
              style={{ background: article.sourceColor }}
            >
              {article.source}
            </span>
            <span className="article-category-badge">
              {article.category.toUpperCase()}
            </span>
          </div>

          {/* Headline */}
          <h1 className="article-headline">{article.title}</h1>

          {/* Meta bar */}
          <div className="article-meta-bar">
            <span className="article-meta-item">
              <Clock size={14} /> {formattedDate}
            </span>
            <span className="article-meta-item">
              <Clock size={14} /> {getRelativeTime(article.pubDate)}
            </span>
            <span className="article-meta-item">
              <BookOpen size={14} /> {article.readingTime} min read
            </span>
          </div>

          {/* Hero image */}
          <NewsImage
            src={article.imageUrl}
            alt={article.title}
            className="article-hero-img"
            fallbackSeed={encodeURIComponent(article.title.slice(0, 20))}
            loading="eager"
          />

          {/* Content */}
          {hasRichContent ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
            />
          ) : (
            <div className="article-description-box">
              <p>{article.description || "No additional content available from this feed."}</p>
            </div>
          )}

          {/* External source link */}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="article-source-link"
          >
            <ExternalLink size={15} />
            Read full article at {article.source}
          </a>
        </article>

        {/* Sidebar */}
        <aside className="article-sidebar">
          <div className="article-sidebar-card float-in" style={{ animationDelay: "0.15s" }}>
            <div className="sidebar-title">More from {article.source}</div>
            {related.length === 0 ? (
              <p style={{ color: "var(--text-dim)", fontSize: "0.83rem" }}>No related articles found.</p>
            ) : (
              related.map((rel, i) => (
                <Link
                  key={rel.id}
                  href={`/article?link=${encodeURIComponent(rel.link)}&source=${encodeURIComponent(rel.source)}`}
                  className="related-article"
                  style={{ animationDelay: `${0.2 + i * 0.07}s` }}
                >
                  <NewsImage
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="related-img"
                    fallbackSeed={encodeURIComponent(rel.title.slice(0, 15))}
                  />
                  <div className="related-info">
                    <div className="related-title">{rel.title}</div>
                    <div className="related-time">{getRelativeTime(rel.pubDate)}</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Share card */}
          <div className="article-sidebar-card float-in" style={{ animationDelay: "0.25s" }}>
            <div className="sidebar-title">Share</div>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.link)}`}
              target="_blank" rel="noopener noreferrer"
              className="article-source-link"
              style={{ width: "100%", justifyContent: "center", marginTop: 0 }}
            >
              <Share2 size={14} /> Share on 𝕏
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
