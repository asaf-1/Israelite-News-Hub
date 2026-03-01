"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setProgress(0);
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setProgress(Math.min(100, (scrollTop / docHeight) * 100));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [pathname]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #0038B8, #4F8EFF, #0038B8)",
        backgroundSize: "200% 100%",
        animation: progress > 0 ? "gradientShift 2s ease infinite" : "none",
        zIndex: 9999,
        transition: "width 0.1s ease",
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 8px rgba(0,56,184,0.6)",
      }}
    />
  );
}
