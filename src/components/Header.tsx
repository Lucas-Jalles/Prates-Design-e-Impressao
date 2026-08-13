"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const currentSearch = searchParams.get("q") || "";

  // Sync localSearch with URL param on mount
  useEffect(() => {
    setLocalSearch(currentSearch);
  }, [currentSearch]);

  // Sugestoes vêm do cache - não buscamos mais na planilha automaticamente
  // O autocomplete agora usa dados locais ou pode ser preenchido manualmente

  const filteredSuggestions = suggestions.filter((name) =>
    name.toLowerCase().includes(localSearch.toLowerCase())
  ).slice(0, 8);

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = localSearch.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.delete("categoria");
      params.delete("subcategoria");
      router.push(`${pathname}?${params.toString()}`);
      setShowSuggestions(false);
    },
    [searchParams, pathname, router, localSearch]
  );

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("categoria");
    params.delete("subcategoria");
    router.push(`${pathname}?${params.toString()}`);
    setLocalSearch("");
    setShowSuggestions(false);
  }, [searchParams, pathname, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearch(suggestion);
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", suggestion);
    params.delete("categoria");
    params.delete("subcategoria");
    router.push(`${pathname}?${params.toString()}`);
    setShowSuggestions(false);
  };

  return (
    <header className="header-sticky sticky top-0 z-30">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
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

          {/* Campo de pesquisa com autocomplete */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0 flex gap-2 relative">
            <input
              type="search"
              name="q"
              placeholder="Buscar serviços..."
              value={localSearch}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="flex-1 bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted"
              autoComplete="off"
            />
            
            {localSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="shrink-0 w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-foreground/60 transition active:scale-95"
                aria-label="Limpar pesquisa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Dropdown de sugestões customizado */}
            {showSuggestions && localSearch.trim().length > 0 && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSuggestionClick(name)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}