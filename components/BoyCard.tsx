"use client";

import Image from "next/image";
import { useState } from "react";
import type { Boy } from "@/lib/boys";
import type { Assignment } from "./types";

type BoyCardProps = {
  boy: Boy;
  assignment: Assignment;
  isSpinning: boolean;
  hasSpun: boolean;
};

export function BoyCard({ boy, assignment, isSpinning, hasSpun }: BoyCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isChud = assignment === "CHUD";

  return (
    <article className={`boy-card ${isChud ? "is-chud" : "is-stud"} ${hasSpun ? "has-ruling" : ""}`}>
      <div className="card-corner" aria-hidden="true">#{boy.id === "carter" ? "01" : boy.id === "gabe" ? "02" : "03"}</div>
      <div className="boy-photo">
        <Image
          src={imageFailed ? "/images/boy-placeholder.svg" : boy.image}
          alt={boy.imageAlt}
          fill
          priority
          sizes="(max-width: 719px) 32vw, (max-width: 1499px) 31vw, 450px"
          style={{ objectFit: "cover", objectPosition: boy.position }}
          unoptimized={boy.isAnimated || imageFailed}
          onError={() => setImageFailed(true)}
        />
        <div className="photo-halftone" />
        <div className="scanline" />
        {isChud && !isSpinning && hasSpun && <div className="chud-stamp" aria-hidden="true">CERTIFIED</div>}
      </div>
      <div className="boy-name">{boy.name}</div>
      <div className="assignment-label">
        <span className="label-stars" aria-hidden="true">★</span>
        <span>{assignment}</span>
        <span className="label-stars" aria-hidden="true">★</span>
      </div>
      <span className="sr-only">{boy.name} is currently assigned {assignment}</span>
    </article>
  );
}
