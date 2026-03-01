"use client";

import { useEffect } from "react";

export default function RippleEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find nearest interactive parent
      const el = target.closest(
        "a, button, .article-card, .hero-article, .nav-link, .mobile-nav-link, .ticker-item, .icon-btn"
      ) as HTMLElement | null;
      if (!el) return;

      // Prevent duplicate ripples
      const existingRipple = el.querySelector(".ripple-circle");
      if (existingRipple) existingRipple.remove();

      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-circle";
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%);
        transform: scale(0);
        animation: ripple-expand 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 9999;
      `;

      // Ensure el is positioned
      const currentPosition = getComputedStyle(el).position;
      if (currentPosition === "static") {
        el.style.position = "relative";
      }
      el.style.overflow = "hidden";
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
