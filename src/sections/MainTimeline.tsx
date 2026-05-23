import TimelineNavigation from "@/components/TimelineNavigation";
import { decades } from "@/data/site";
import TimelineSection from "./TimelineSection";

export default function MainTimeline() {
  return (
    <section id="timeline" className="relative bg-ink">
      <TimelineNavigation />
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 timeline-rail lg:block" />
      {decades.map((decade) => (
        <TimelineSection key={decade.decade} decade={decade} />
      ))}
    </section>
  );
}
