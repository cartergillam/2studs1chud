"use client";

import { useEffect, useRef, useState } from "react";
import { AssignmentSpinner } from "./AssignmentSpinner";
import { BoyCard } from "./BoyCard";
import { ChudScoreboard } from "./ChudScoreboard";
import type { Assignment, Boy } from "./types";

// Edit names and image paths here. Friend One uses a GIF on purpose.
export const boys: Boy[] = [
  { id: "carter", name: "Carter", image: "/images/carter.jpg", imageAlt: "Carter awaiting judgment", position: "50% 35%" },
  { id: "friend-one", name: "Friend One", image: "/images/friend-one.gif", imageAlt: "Friend One awaiting judgment", isAnimated: true, position: "50% 35%" },
  { id: "friend-two", name: "Friend Two", image: "/images/friend-two.jpg", imageAlt: "Friend Two awaiting judgment", position: "50% 35%" },
];

const initialAssignments: Assignment[] = ["STUD", "CHUD", "STUD"];

export function BoysStage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [displayAssignments, setDisplayAssignments] = useState<Assignment[]>(initialAssignments);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [chudCounts, setChudCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(boys.map((boy) => [boy.id, 0])),
  );
  const shuffleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (shuffleTimer.current) clearInterval(shuffleTimer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
  }, []);

  function spin() {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasSpun(true);

    shuffleTimer.current = setInterval(() => {
      const temporaryChud = Math.floor(Math.random() * boys.length);
      setDisplayAssignments(boys.map((_, index) => index === temporaryChud ? "CHUD" : "STUD"));
    }, 110);

    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 450 : 2450;
    finishTimer.current = setTimeout(() => {
      if (shuffleTimer.current) clearInterval(shuffleTimer.current);
      const chudIndex = Math.floor(Math.random() * boys.length);
      const finalAssignments = boys.map((_, index): Assignment => index === chudIndex ? "CHUD" : "STUD");
      setAssignments(finalAssignments);
      setDisplayAssignments(finalAssignments);
      setChudCounts((counts) => ({ ...counts, [boys[chudIndex].id]: counts[boys[chudIndex].id] + 1 }));
      setIsSpinning(false);
    }, duration);
  }

  return (
    <section className="arena" aria-label="The boy allocation arena" aria-busy={isSpinning}>
      <div className={`stage ${isSpinning ? "is-spinning" : ""}`}>
        {boys.map((boy, index) => (
          <BoyCard
            key={boy.id}
            boy={boy}
            assignment={displayAssignments[index]}
            isSpinning={isSpinning}
            hasSpun={hasSpun}
          />
        ))}
      </div>

      <AssignmentSpinner onSpin={spin} isSpinning={isSpinning} />
      <p className="result-announcer" role="status" aria-live="polite">
        {isSpinning
          ? "The commission is reviewing the boys..."
          : hasSpun
            ? `BREAKING: ${boys[assignments.indexOf("CHUD")].name} is the Chud.`
            : "Current ruling is provisional. Spin to make it official."}
      </p>
      <ChudScoreboard boys={boys} counts={chudCounts} />
    </section>
  );
}
