import type { Boy, ChudCounts } from "@/lib/boys";

type ChudScoreboardProps = {
  boys: readonly Boy[];
  counts: ChudCounts;
  mode: "loading" | "global" | "local";
  notice?: string;
};

export function ChudScoreboard({ boys, counts, mode, notice }: ChudScoreboardProps) {
  const ranked = [...boys].sort((a, b) => counts[b.id] - counts[a.id]);
  const highScore = Math.max(...Object.values(counts));
  const leaders = ranked.filter((boy) => counts[boy.id] === highScore);
  const isDeadlock = highScore > 0 && leaders.length > 1;

  return (
    <aside className="scoreboard" aria-label={mode === "loading" ? "Chud standings" : `${mode === "global" ? "Global" : "Local"} Chud standings`}>
      <div className="scoreboard-title">
        <span>{mode === "loading" ? "CONTACTING HEAD OFFICE" : "OFFICIAL TOTALS"}</span>
        <strong>{mode === "loading" ? "CHUD STANDINGS" : `${mode === "global" ? "GLOBAL" : "LOCAL"} CHUD STANDINGS`}</strong>
      </div>
      <div className="leaderboard-rows">
        {ranked.map((boy, index) => {
          const isLeader = highScore > 0 && counts[boy.id] === highScore;
          return (
            <div className={`leaderboard-row ${isLeader ? "is-leader" : ""}`} key={boy.id}>
              <span className="leaderboard-rank">#{index + 1}</span>
              <strong>{boy.name}</strong>
              {isLeader && <em>{isDeadlock ? "CHUD DEADLOCK" : "REIGNING CHUD"}</em>}
              <span className="leaderboard-count">{String(counts[boy.id]).padStart(2, "0")}</span>
            </div>
          );
        })}
      </div>
      <p className="scoreboard-footnote">Every completed spin counts toward the global humiliation.</p>
      {notice && <p className="scoreboard-notice" role="status">{notice}</p>}
    </aside>
  );
}
