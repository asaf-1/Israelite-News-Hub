import Link from "next/link";
import { CATEGORIES } from "@/lib/sources";
import { Rss, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="logo-emblem">✡</span>
            <div>
              <span className="logo-name">Israelite</span>
              <span className="logo-sub">News Hub</span>
            </div>
          </Link>
          <p className="footer-tagline">
            Your trusted source for comprehensive coverage of Israel and the Jewish world.
            Aggregating the most important stories from leading Israeli and international media.
          </p>
          <div className="footer-sources">
            <Rss size={13} />
            <span>Jerusalem Post · Times of Israel · Haaretz · i24 · Arutz Sheva · JTA · Ynet · Israel Hayom</span>
          </div>
          <div className="footer-flags">
            🇮🇱 &nbsp; Powered by live RSS feeds &nbsp; · &nbsp; Updated every 5 minutes
          </div>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="footer-link">
                  {cat.icon} {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link href="/" className="footer-link">Home</Link></li>
            <li><Link href="/search?q=israel" className="footer-link">Latest on Israel</Link></li>
            <li><Link href="/search?q=idf" className="footer-link">IDF Updates</Link></li>
            <li><Link href="/search?q=jerusalem" className="footer-link">Jerusalem</Link></li>
            <li><Link href="/search?q=technology" className="footer-link">Israeli Tech</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Sources</h4>
          <ul>
            <li><a href="https://www.jpost.com" target="_blank" rel="noopener noreferrer" className="footer-link">Jerusalem Post</a></li>
            <li><a href="https://www.timesofisrael.com" target="_blank" rel="noopener noreferrer" className="footer-link">Times of Israel</a></li>
            <li><a href="https://www.haaretz.com" target="_blank" rel="noopener noreferrer" className="footer-link">Haaretz</a></li>
            <li><a href="https://www.i24news.tv" target="_blank" rel="noopener noreferrer" className="footer-link">i24 News</a></li>
            <li><a href="https://www.jta.org" target="_blank" rel="noopener noreferrer" className="footer-link">JTA</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} Israelite News Hub. All news content belongs to respective publishers.
            This is a news aggregator — not affiliated with any news organization.
          </p>
          <div className="footer-bottom-links">
            <Mail size={13} /> Demo Project
          </div>
        </div>
      </div>
    </footer>
  );
}
