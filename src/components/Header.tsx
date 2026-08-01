"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="px-4 py-4">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-lg overflow-hidden" aria-label="Início">
          <Image
            src="/logo.jpeg"
            alt="Prates Gráfica"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Campo de pesquisa */}
        <div className="flex-1 min-w-0">
          <input
            type="search"
            placeholder="Buscar serviços..."
            className="w-full bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted"
          />
        </div>
      </div>
    </header>
  );
}