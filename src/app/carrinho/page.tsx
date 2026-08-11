"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatCurrency, getWhatsAppUrl, buildCartMessage } from "@/lib/whatsapp";
import { effectivePrice, isPromoActive } from "@/lib/product";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clear } = useCart();
  const [finalizing, setFinalizing] = useState(false);

  const handleFinish = () => {
    if (items.length === 0) return;
    setFinalizing(true);
    const msg = buildCartMessage(items);
    const url = getWhatsAppUrl(msg);
    window.location.href = url;
  };

  return (
    <div className="max-w-md mx-auto pb-32">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">Carrinho</h1>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-alert bg-alert/10 hover:bg-alert/20 px-3 py-2 rounded-lg transition"
          >
            <span>🗑️</span>
            <span>Limpar</span>
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm text-muted mb-4">
            Seu carrinho está vazio.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white text-sm font-semibold rounded-xl px-5 py-3"
          >
            Ver serviços
          </Link>
        </div>
      ) : (
        <>
          <ul className="px-4 py-2 flex flex-col gap-3">
            {items.map((item) => {
              const price = effectivePrice(item.service);
              const hasPromo = isPromoActive(item.service.promo_ativa, item.service.prazo_oferta) && item.service.valor_desconto !== null;
              return (
                <li
                  key={item.service.id}
                  className="flex gap-3 bg-white rounded-xl shadow-sm p-3"
                >
                  <Link
                    href={`/servico/${item.service.id}`}
                    className="shrink-0"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.service.imagem_url}
                        alt={item.service.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <Link
                      href={`/servico/${item.service.id}`}
                      className="text-sm font-medium line-clamp-2"
                    >
                      {item.service.nome}
                    </Link>
                    <span className="text-xs text-muted capitalize">
                      {item.service.subcategoria || item.service.categoria}
                    </span>
                    {hasPromo && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatCurrency(item.service.valor_original)}
                      </span>
                    )}
                    <span className="text-sm font-bold">
                      {formatCurrency(price)}
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.service.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg leading-none font-medium transition flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.service.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg leading-none font-medium transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.service.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-alert bg-alert/10 hover:bg-alert/20 px-3 py-2 rounded-lg transition"
                      >
                        <span>🗑️</span>
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-4 mt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Subtotal</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-muted mb-3">
              Pagamento combinado via WhatsApp.
            </p>
          </div>

          <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-40">
            <button
              onClick={handleFinish}
              disabled={finalizing}
              className="w-full bg-action text-white text-base font-semibold rounded-xl py-4 shadow-lg transition active:scale-95 disabled:opacity-70"
            >
              {finalizing ? "Abrindo WhatsApp..." : "Finalizar pedido"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}