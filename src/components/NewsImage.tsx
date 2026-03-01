"use client";

interface Props {
  src: string;
  alt: string;
  className?: string;
  fallbackSeed?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}

export default function NewsImage({ src, alt, className, fallbackSeed, style, loading = "lazy" }: Props) {
  const seed = fallbackSeed || encodeURIComponent(alt.slice(0, 30));
  const fallback = `https://picsum.photos/seed/${seed}/800/500`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallback) {
          target.src = fallback;
        }
      }}
    />
  );
}
