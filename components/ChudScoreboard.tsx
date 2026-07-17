import type { Boy } from "./types";

type ChudScoreboardProps = {
  boys: Boy[];
  counts: Record<string, number>;
};

export function ChudScoreboard({ boys, counts }: ChudScoreboardProps) {
  return (
    <aside className="scoreboard" aria-label="Chud count for this browser session">
      <div className="scoreboard-title">
        <span>SESSION STATISTICS</span>
        <strong>CHUD COUNT</strong>
      </div>
      <div className="scoreboard-scores">
        {boys.map((boy) => (
          <div className="score" key={boy.id}>
            <span>{boy.name}</span>
            <strong>{String(counts[boy.id]).padStart(2, "0")}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}
