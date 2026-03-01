import { getArticlesByCategory } from "@/lib/rss";
import { CATEGORIES } from "@/lib/sources";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.label} – Israelite News Hub`,
    description: `Latest Israeli ${category.label} news from top sources.`,
  };
}

export const revalidate = 300;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(slug);

  return (
    <div className="category-page">
      <Link href="/" className="article-back">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="category-hero">
        <p className="category-eyebrow">Category</p>
        <h1>{category.icon} {category.label}</h1>
        <p>{articles.length} articles from top Israeli sources</p>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <h2>No articles available</h2>
          <p>This feed may be temporarily unavailable. Please refresh later.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((article, i) => (
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
