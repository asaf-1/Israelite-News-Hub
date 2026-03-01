import { getAllArticles } from "@/lib/rss";
import ArticleCard from "@/components/ArticleCard";
import { SearchX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" – Israelite News Hub` : "Search – Israelite News Hub",
    description: "Search Israeli news articles.",
  };
}

export const revalidate = 300;

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const all = await getAllArticles();

  const results = query
    ? all.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.source.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      )
    : all;

  return (
    <div className="search-page">
      <Link href="/" className="article-back">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <h1>
        {query ? (
          <>Results for <span style={{ color: "var(--accent-light)" }}>&ldquo;{q}&rdquo;</span></>
        ) : (
          "All Articles"
        )}
      </h1>
      <p className="subtitle">
        {results.length} article{results.length !== 1 ? "s" : ""} found
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <SearchX size={52} style={{ margin: "0 auto 16px", opacity: 0.35 }} />
          <h2>No results found</h2>
          <p>Try searching for &ldquo;IDF&rdquo;, &ldquo;Jerusalem&rdquo;, or &ldquo;Netanyahu&rdquo;.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {results.map((article, i) => (
            <div
              key={article.id}
              className="fade-up"
              style={{ animationDelay: `${(i % 12) * 0.05}s` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
