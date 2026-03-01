"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Article } from "@/lib/rss";
import { Radio } from "lucide-react";

interface Props {
  articles: Article[];
}

function buildArticleUrl(article: Article): string {
  return `/article?link=${encodeURIComponent(article.link)}&source=${encodeURIComponent(article.source)}`;
}

export default function NewsTicker({ articles }: Props) {
  const items = articles.slice(0, 14);

  return (
    <div className="ticker-wrap">
      <div className="ticker-label">
        <Radio size={13} className="ticker-icon" />
        LIVE
      </div>
      <div className="ticker-overflow">
        <div className="ticker-track">
          {[...items, ...items].map((a, i) => (
            <Link
              key={i}
              href={buildArticleUrl(a)}
              className="ticker-item"
              prefetch={false}
            >
              <span className="ticker-source" style={{ color: a.sourceColor }}>
                {a.source}
              </span>
              {a.title}
              <span className="ticker-sep">·</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
