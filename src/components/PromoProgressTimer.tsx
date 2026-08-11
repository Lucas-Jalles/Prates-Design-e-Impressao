"use client";

import { useEffect, useState } from "react";

interface Props {
  deadline: string | null;
  className?: string;
}

export default function PromoProgressTimer({ deadline, className }: Props) {
  const [now, setNow] = useState<number>(() => Date.now());
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!deadline) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpired(true);
      return;
    }
    const target = new Date(deadline).getTime();
    if (!Number.isFinite(target)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpired(true);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpired(target <= Date.now());
    const id = setInterval(() => {
      const cur = Date.now();
      setNow(cur);
      if (cur >= target) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpired(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  // Pulse animation for urgency
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(id);
  }, []);

  // Calculate progress
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!deadline || expired) return;
    const target = new Date(deadline).getTime();
    const remaining = target - now;
    if (remaining <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(0);
      return;
    }
    const maxDuration = 30 * 24 * 60 * 60 * 1000;
    const p = Math.max(0, Math.min(100, (remaining / maxDuration) * 100));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(p);
  }, [now, deadline, expired]);

  if (expired || !deadline) return null;

  const remaining = new Date(deadline).getTime() - now;
  if (remaining <= 0) return null;

  const s = Math.floor(remaining / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Adaptive format: show only the most relevant unit
  let timeStr: string;
  if (d > 0) {
    timeStr = `${d}D`;
  } else if (h > 0) {
    timeStr = `${String(h).padStart(2, "0")}h`;
  } else if (m > 0) {
    timeStr = `${String(m).padStart(2, "0")}m`;
  } else {
    timeStr = `${String(sec).padStart(2, "0")}s`;
  }

  return (
    <div className={`relative inline-flex ${className ?? ""}`}>
      {/* Tag-like progress bar with time INSIDE the pink fill */}
      <div className="relative flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 overflow-hidden">
        {/* Background track */}
        <div
          className="absolute inset-0 bg-gray-200 rounded-full"
        />
        {/* Progress fill with time INSIDE */}
        <div
          className="relative h-full bg-gradient-to-r from-accent/90 via-accent to-accent/70 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Time text INSIDE the pink progress bar - moves with the edge */}
          <span
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white whitespace-nowrap flex items-center gap-1 pr-2"
            style={{ left: `${progress > 5 ? '100%' : 'auto'}` }}
          >
            <span className={`relative ${pulse && progress < 20 ? "animate-pulse" : ""}`}>
              ⏳
            </span>
            <span className="font-mono text-[10px]">
              {d > 0 ? `${d}D` : h > 0 ? `${String(h).padStart(2, "0")}h` : m > 0 ? `${String(m).padStart(2, "0")}m` : `${String(s % 60).padStart(2, "0")}s`}
            </span>
          </span>
        </div>

        {/* Unfilled portion */}
        <div
          className="absolute right-0 top-0 bottom-0 w-full bg-transparent"
          style={{ width: `${100 - progress}%` }}
        />

        {/* Pulse ring when urgent */}
        {progress < 15 && (
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Warning pulse icon when urgent */}
      {progress < 15 && (
        <span className={`flex items-center justify-center w-5 h-5 ${pulse ? "animate-pulse" : ""} text-accent`}>
          ⏳
        </span>
      )}
    </div>
  );
}