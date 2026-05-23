"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { decades } from "@/data/site";
import { cn } from "@/utils/cn";

export default function TimelineNavigation() {
  const [active, setActive] = useState(decades[0].decade);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  const sections = document.querySelectorAll("[data-decade]");

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      const activeEntry = entries.find(
        (entry: IntersectionObserverEntry) => entry.isIntersecting
      );

      if (activeEntry) {
        const decade = activeEntry.target.getAttribute("data-decade");
        if (decade) {
          setActive(decade);
        }
      }
    },
    {
      threshold: 0.5,
    }
  );

  sections.forEach((section) => observer.observe(section));

  return () => observer.disconnect();
}, []);

  useEffect(() => {
    const updateVisibility = () => {
      const timeline = document.getElementById("timeline");
      if (!timeline) return;
      const rect = timeline.getBoundingClientRect();
      setVisible(rect.top < window.innerHeight * 0.78 && rect.bottom > window.innerHeight * 0.28);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const handleDecadeClick = (decade: string) => {
    const element = document.getElementById(decade);
    if (element) {
      // Immediately update active state
      setActive(decade);
      // Smooth scroll to section
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav
      aria-label="Timeline navigation"
      className={cn(
        "fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-ink/72 px-2 py-2 shadow-glass backdrop-blur-xl transition-opacity duration-300 lg:bottom-auto lg:left-6 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2 lg:flex-col",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="hidden size-9 place-items-center rounded-full bg-white/10 text-mintPulse lg:grid">
        <CalendarDays size={17} />
      </div>
      {decades.map((item) => {
        const isActive = active === item.decade;
        return (
          <button
            type="button"
            key={item.decade}
            onClick={() => handleDecadeClick(item.decade)}
            className={cn(
              "min-w-12 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-300",
              isActive 
                ? "bg-mintPulse text-ink shadow-[0_0_24px_rgba(255,209,102,0.44)]" 
                : "text-surgical/62 hover:bg-white/10 hover:text-white"
            )}
            aria-current={isActive ? "true" : undefined}
          >
            {item.decade}
          </button>
        );
      })}
    </nav>
  );
}
