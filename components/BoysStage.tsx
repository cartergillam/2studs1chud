"use client";

import { useEffect, useRef, useState } from "react";
import { boys, emptyChudCounts, type BoyId, type ChudCounts } from "@/lib/boys";
import { AssignmentSpinner } from "./AssignmentSpinner";
import { BoyCard } from "./BoyCard";
import { ChudScoreboard } from "./ChudScoreboard";
import type { Assignment } from "./types";

type LeaderboardMode = "loading" | "global" | "local";
type LeaderboardResponse = {
  mode: Exclude<LeaderboardMode, "loading">;
  counts: ChudCounts;
  error?: string;
};

const initialAssignments: Assignment[] = ["STUD", "CHUD", "STUD"];
const resultHeadlines = [
  "INDEPENDENT EXPERTS HAVE CONFIRMED THE CHUD.",
  "THE REVIEW BOARD FOUND NO EVIDENCE OF STUD.",
  "OFFICIALS ARE CALLING IT A HISTORIC CHUD PERFORMANCE.",
  "THE VERDICT IS FINAL. APPEALS WILL BE IGNORED.",
  "SOURCES CLOSE TO THE SITUATION SAY THIS WAS INEVITABLE.",
  "A DEVASTATING RESULT FOR THE CHUD'S CAMP.",
  "THE STUDS HAVE BEEN CLEARED OF ALL ALLEGATIONS.",
];

let leaderboardRequest: Promise<LeaderboardResponse> | null = null;

function fetchLeaderboardOnce() {
  if (!leaderboardRequest) {
    leaderboardRequest = fetch("/api/leaderboard", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("Leaderboard unavailable");
      return response.json() as Promise<LeaderboardResponse>;
    });
  }
  return leaderboardRequest;
}

function getSessionId(fallback: React.MutableRefObject<string>) {
  if (fallback.current) return fallback.current;
  try {
    const stored = window.sessionStorage.getItem("2s1c-session-id");
    if (stored) return (fallback.current = stored);
    const created = crypto.randomUUID();
    window.sessionStorage.setItem("2s1c-session-id", created);
    return (fallback.current = created);
  } catch {
    return (fallback.current = crypto.randomUUID());
  }
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  if (!document.execCommand("copy")) throw new Error("Copy failed");
  textarea.remove();
}

export function BoysStage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [displayAssignments, setDisplayAssignments] = useState<Assignment[]>(initialAssignments);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [headline, setHeadline] = useState(resultHeadlines[0]);
  const [counts, setCounts] = useState<ChudCounts>(emptyChudCounts);
  const [leaderboardMode, setLeaderboardMode] = useState<LeaderboardMode>("loading");
  const [leaderboardNotice, setLeaderboardNotice] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const spinLock = useRef(false);
  const activeSpinId = useRef("");
  const recordedSpinIds = useRef(new Set<string>());
  const sessionId = useRef("");
  const shuffleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    fetchLeaderboardOnce()
      .then((data) => {
        if (!active) return;
        setCounts(data.counts);
        setLeaderboardMode(data.mode);
      })
      .catch(() => {
        if (!active) return;
        setLeaderboardMode("local");
        setLeaderboardNotice("Global filings are unavailable. This session still counts locally.");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    spinLock.current = false;
    if (shuffleTimer.current) clearInterval(shuffleTimer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
    if (shareTimer.current) clearTimeout(shareTimer.current);
  }, []);

  async function recordCompletedSpin(personId: BoyId, spinId: string) {
    if (recordedSpinIds.current.has(spinId)) return;
    recordedSpinIds.current.add(spinId);

    if (leaderboardMode === "local") {
      setCounts((current) => ({ ...current, [personId]: current[personId] + 1 }));
      return;
    }

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, spinId, sessionId: getSessionId(sessionId) }),
      });
      const data = await response.json() as LeaderboardResponse;

      if (data.mode === "local") {
        setLeaderboardMode("local");
        setCounts((current) => ({ ...current, [personId]: current[personId] + 1 }));
        return;
      }
      if (data.counts) setCounts(data.counts);
      if (!response.ok && !data.mode) {
        setLeaderboardMode("local");
        setCounts((current) => ({ ...current, [personId]: current[personId] + 1 }));
      }
      if (!response.ok) setLeaderboardNotice(data.error || "The global filing failed. The verdict still stands.");
      else setLeaderboardNotice("");
    } catch {
      setLeaderboardMode("local");
      setCounts((current) => ({ ...current, [personId]: current[personId] + 1 }));
      setLeaderboardNotice("The global filing failed. The verdict still stands.");
    }
  }

  function spin() {
    if (spinLock.current) return;
    spinLock.current = true;
    activeSpinId.current = crypto.randomUUID();
    setIsSpinning(true);
    setHasSpun(true);
    setShareStatus("");

    shuffleTimer.current = setInterval(() => {
      const temporaryChud = Math.floor(Math.random() * boys.length);
      setDisplayAssignments(boys.map((_, index) => index === temporaryChud ? "CHUD" : "STUD"));
    }, 110);

    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 450 : 2450;
    finishTimer.current = setTimeout(() => {
      if (shuffleTimer.current) clearInterval(shuffleTimer.current);
      const chudIndex = Math.floor(Math.random() * boys.length);
      const finalAssignments = boys.map((_, index): Assignment => index === chudIndex ? "CHUD" : "STUD");
      const completedSpinId = activeSpinId.current;
      setAssignments(finalAssignments);
      setDisplayAssignments(finalAssignments);
      setHeadline(resultHeadlines[Math.floor(Math.random() * resultHeadlines.length)]);
      spinLock.current = false;
      setIsSpinning(false);
      void recordCompletedSpin(boys[chudIndex].id, completedSpinId);
    }, duration);
  }

  async function shareVerdict() {
    const currentChud = boys[assignments.indexOf("CHUD")];
    const text = `BREAKING: ${currentChud.name} has officially been declared the Chud by the Stud/Chud Selection Authority. https://2studs1chud.com`;
    try {
      if (navigator.share) await navigator.share({ title: "2 Studs 1 Chud", text });
      else {
        await copyText(text);
        setShareStatus("VERDICT COPIED");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await copyText(text);
        setShareStatus("VERDICT COPIED");
      } catch {
        setShareStatus("COPY FAILED — THE AUTHORITY REGRETS THE ERROR");
      }
    }
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareStatus(""), 2200);
  }

  const finalChudIndex = assignments.indexOf("CHUD");
  const finalStudIndices = boys.map((_, index) => index).filter((index) => index !== finalChudIndex);

  function pyramidPosition(index: number) {
    if (index === finalChudIndex) return "pyramid-top";
    return index === finalStudIndices[0] ? "pyramid-left" : "pyramid-right";
  }

  return (
    <section className="arena" aria-label="The Stud/Chud Selection Authority arena" aria-busy={isSpinning}>
      <div className={`stage ${isSpinning ? "is-spinning" : ""}`}>
        {boys.map((boy, index) => (
          <div className={`boy-slot ${pyramidPosition(index)}`} key={boy.id}>
            <BoyCard boy={boy} assignment={displayAssignments[index]} isSpinning={isSpinning} hasSpun={hasSpun} />
          </div>
        ))}
      </div>

      <AssignmentSpinner onSpin={spin} isSpinning={isSpinning} />
      <div className="verdict-panel" role="status" aria-live="polite">
        <p className="result-announcer">
          {isSpinning
            ? "The Selection Authority is reviewing the boys..."
            : hasSpun
              ? `BREAKING: ${boys[finalChudIndex].name} is the Chud.`
              : "Current ruling is provisional. Spin to make it official."}
        </p>
        {hasSpun && !isSpinning && <p className="result-headline">{headline}</p>}
        {hasSpun && !isSpinning && (
          <div className="share-row">
            <button className="share-button" type="button" onClick={shareVerdict}>SHARE THE VERDICT</button>
            <span>{shareStatus}</span>
          </div>
        )}
      </div>
      <ChudScoreboard boys={boys} counts={counts} mode={leaderboardMode} notice={leaderboardNotice} />
    </section>
  );
}
