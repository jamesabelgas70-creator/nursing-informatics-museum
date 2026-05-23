import { Cpu, Database, Medal, Sparkles } from "lucide-react";
import type { Decade } from "@/data/site";

type DecadeCardProps = {
  decade: Decade;
};

export default function DecadeCard({ decade }: DecadeCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="glass-panel rounded-lg p-5" data-reveal>
        <div className="mb-4 flex items-center gap-3 text-mintPulse">
          <Sparkles size={18} />
          <span className="text-sm font-semibold">Highlights</span>
        </div>
        <ul className="space-y-3 text-sm leading-relaxed text-surgical/82">
          {decade.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="glass-panel rounded-lg p-5" data-reveal>
        <div className="mb-4 flex items-center gap-3 text-cyanGlow">
          <Cpu size={18} />
          <span className="text-sm font-semibold">Developments</span>
        </div>
        <ul className="space-y-3 text-sm leading-relaxed text-surgical/82">
          {decade.developments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="glass-panel rounded-lg p-5" data-reveal>
        <div className="mb-4 flex items-center gap-3 text-pioneerGold">
          {decade.majorEvent ? <Medal size={18} /> : <Database size={18} />}
          <span className="text-sm font-semibold">
            {decade.majorEvent ? "Major Event" : "Signals"}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-surgical/82">
          {decade.majorEvent ?? decade.effects.join(" / ")}
        </p>
        {decade.contributions && (
          <div className="mt-4 flex flex-wrap gap-2">
            {decade.contributions.map((item) => (
              <span
                key={item}
                className="rounded-full border border-pioneerGold/30 bg-pioneerGold/10 px-3 py-1 text-xs text-pioneerGold"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
