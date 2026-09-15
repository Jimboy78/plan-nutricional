"use client";

import { useMemo } from "react";

const COLORS = ["#e87722", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6"];

export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.6,
      })),
    [pieces]
  );

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          style={{
            left: `${b.left}%`,
            background: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            transform: `rotate(${b.rotate}deg)`,
            borderRadius: b.round ? "50%" : 2,
          }}
        />
      ))}
    </div>
  );
}
