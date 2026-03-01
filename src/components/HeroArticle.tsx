import Link from "next/link";
import { Article, getRelativeTime } from "@/lib/rss";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import NewsImage from "./NewsImage";

interface Props {
  article: Article;
}

function buildArticleUrl(article: Article): string {
  return `/article?link=${encodeURIComponent(article.link)}&source=${encodeURIComponent(article.source)}`;
}

export default function HeroArticle({ article }: Props) {
  return (
    <Link href={buildArticleUrl(article)} className="hero-article" prefetch={false}>
      <NewsImage
        src={article.imageUrl}
        alt={article.title}
        className="hero-img"
        fallbackSeed="israel-hero-landscape"
        loading="eager"
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-meta">
          <span className="hero-badge" style={{ background: article.sourceColor }}>
            {article.source}
          </span>
          <span className="hero-category">{article.category.toUpperCase()}</span>
          <span className="hero-time">
            <Clock size={13} /> {getRelativeTime(article.pubDate)}
          </span>
          <span className="hero-time">
            <BookOpen size={13} /> {article.readingTime} min
          </span>
        </div>

        <h1 className="hero-title">{article.title}</h1>

        {article.description && (
          <p className="hero-desc">{article.description}</p>
        )}

        <div className="hero-cta">
          Read Full Story <ArrowRight size={16} />
        </div>
      </div>

      {/* Animated corner accent */}
      <div className="hero-corner-flag">🇮🇱</div>
    </Link>
  );
}
