"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

interface CategoryChipsProps {
  categories: string[];
  active?: string;
  paramName?: string;
  values?: string[];
  baseParams?: Record<string, string>;
}

export default function CategoryChips({
  categories,
  active,
  paramName = "categoria",
  values = categories,
  baseParams = {},
}: CategoryChipsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const buildHref = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(baseParams).forEach(([k, v]) => params.set(k, v));
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div id="categorias" className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
      {([null, ...values] as (string | null)[]).map((v, idx) => (
        <Link
          key={idx}
          href={buildHref(v)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition active:scale-95 ${
            (v === null && !active) || v === active
              ? "bg-primary text-white"
              : "bg-white text-foreground/80 border border-gray-200"
          }`}
        >
          {v === null ? "Todos" : v}
        </Link>
      ))}
    </div>
  );
}