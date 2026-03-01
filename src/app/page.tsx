import { getAllArticles } from "@/lib/rss";
import { CATEGORIES } from "@/lib/sources";
import HeroArticle from "@/components/HeroArticle";
import NewsTicker from "@/components/NewsTicker";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export const revalidate = 300;

export default async function HomePage() {
  const articles = await getAllArticles();
  const hero = articles[0];
  const rest = articles.slice(1);

  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    articles: rest.filter((a) => a.category === cat.slug).slice(0, 6),
  }));

  const allArticles = [...rest];
  const totalSources = new Set(articles.map((a) => a.source)).size;

  return (
    <div>
      {/* Breaking ticker */}
      <NewsTicker articles={articles.slice(0, 20)} />

      {/* Hero */}
      {hero && <HeroArticle article={hero} />}

      <div className="container">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{articles.length}</span>
            <span className="stat-label">Articles Live</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalSources}</span>
            <span className="stat-label">Israeli Sources</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{CATEGORIES.length}</span>
            <span className="stat-label">Topics</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">5m</span>
            <span className="stat-label">Refresh Rate</span>
          </div>
        </div>

        {/* Latest — all categories combined */}
        <section className="section">
          <div className="section-header">
            <div className="section-bar" />
            <h2 className="section-title">🇮🇱 Latest from Israel</h2>
            <Link href="/search?q=israel" className="section-view-all">View all →</Link>
          </div>
          <div className="articles-grid">
            {allArticles.slice(0, 6).map((article, i) => (
              <div key={article.id} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </section>

        {/* Category sections */}
        {byCategory.filter((cat) => cat.articles.length > 0).map((cat) => (
          <section key={cat.slug} className="section category-section">
            <div className="section-header">
              <div className="section-bar" />
              <h2 className="section-title">{cat.icon} {cat.label}</h2>
              <Link href={`/category/${cat.slug}`} className="section-view-all">
                View all →
              </Link>
            </div>
            <div className="articles-grid">
              {cat.articles.map((article, i) => (
                <div key={article.id} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
