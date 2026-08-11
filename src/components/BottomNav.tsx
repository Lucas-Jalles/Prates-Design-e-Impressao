"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function BottomNav() {
  const { totalItems } = useCart();
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1">
        <div className="grid grid-cols-3">
          <NavItem href="/" label="Início" icon="🏠" />
          <NavItem href="/categorias" label="Categorias" icon="🗂️" />
          <NavItem href="/carrinho" label="Carrinho" icon="🛒" badge={totalItems} isCart />
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon,
  badge,
  isCart = false,
}: {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  isCart?: boolean;
}) {
  return (
    <Link
      href={href}
      data-cart-target={isCart ? "" : undefined}
      className="relative flex flex-col items-center justify-center py-2.5 px-2 text-xs font-medium text-foreground/70 hover:text-primary transition rounded-xl active:scale-[0.98]"
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="mt-0.5">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </Link>
  );
}
