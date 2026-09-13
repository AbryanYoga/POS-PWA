/**
 * useScrollReveal — Intersection Observer based scroll reveal
 *
 * Adds the class "scroll-revealed" to every element matching the
 * selector [data-reveal] once it enters the viewport.
 * Elements start invisible (via CSS) and animate in on scroll.
 *
 * Usage: Call this hook once inside a parent component.
 * Then add data-reveal (and optionally data-reveal-delay="100") to any element.
 */

"use client";

import { useEffect } from "react";

interface ScrollRevealOptions {
  /** Root margin — how early to trigger (default: "0px 0px -60px 0px") */
  rootMargin?: string;
  /** Intersection threshold 0-1 (default: 0.08) */
  threshold?: number;
  /** Selector for elements to observe (default: "[data-reveal]") */
  selector?: string;
  /** Whether the observer is active (default: true) */
  enabled?: boolean;
}

export function useScrollReveal({
  rootMargin = "0px 0px -60px 0px",
  threshold = 0.08,
  selector = "[data-reveal]",
  enabled = true,
}: ScrollRevealOptions = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay ?? "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("scroll-revealed");
            // Stop observing once revealed — no re-animation needed
            observer.unobserve(el);
          }
        });
      },
      { rootMargin, threshold }
    );

    // Observe all matching elements currently in DOM
    const attach = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        `${selector}:not(.scroll-revealed)`
      );
      elements.forEach((el) => observer.observe(el));
    };

    attach();

    // MutationObserver — pick up newly rendered elements (tab switches, etc.)
    const mutObserver = new MutationObserver(() => {
      attach();
    });

    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObserver.disconnect();
    };
  }, [rootMargin, threshold, selector, enabled]);
}
