import Link from "next/link";
import { Article, getRelativeTime } from "@/lib/rss";
import { Clock, BookOpen } from "lucide-react";
import NewsImage from "./NewsImage";

interface Props {
  article: Article;
}

function buildArticleUrl(article: Article): string {
  return `/article?link=${encodeURIComponent(article.link)}&source=${encodeURIComponent(article.source)}`;
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link href={buildArticleUrl(article)} className="article-card" prefetch={false}>
      <div className="card-img-wrap">
        <NewsImage
          src={article.imageUrl}
          alt={article.title}
          className="card-img"
          fallbackSeed={encodeURIComponent(article.title.slice(0, 30))}
          loading="lazy"
        />
        <div className="card-img-overlay" />
        <span className="card-category-badge">{article.category.toUpperCase()}</span>
      </div>

      <div className="card-body">
        <div className="card-source" style={{ color: article.sourceColor }}>
          <span className="source-dot" style={{ background: article.sourceColor }} />
          {article.source}
        </div>

        <h3 className="card-title">{article.title}</h3>

        {article.description && (
          <p className="card-desc">{article.description}</p>
        )}

        <div className="card-meta">
          <span className="card-time">
            <Clock size={12} /> {getRelativeTime(article.pubDate)}
          </span>
          <span className="card-read-time">
            <BookOpen size={12} /> {article.readingTime} min read
          </span>
        </div>

        <div className="card-cta">Read Article →</div>
      </div>
    </Link>
  );
}
