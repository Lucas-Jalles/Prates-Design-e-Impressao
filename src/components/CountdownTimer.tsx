"use client";

import { useEffect, useState } from "react";

interface Props {
  deadline: string | null;
  className?: string;
}

function format(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (d > 0) return `${d}d ${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function CountdownTimer({ deadline, className }: Props) {
  const [now, setNow] = useState<number>(0);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => {
      const cur = Date.now();
      setNow(cur);
      if (cur >= target) {
        setExpired(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (expired || !deadline) return null;
  const remaining = new Date(deadline).getTime() - now;
  if (remaining <= 0) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium text-white bg-primary px-2 py-1 rounded-full ${className ?? ""}`}
    >
      ⏱ {format(remaining)}
    </span>
  );
}
