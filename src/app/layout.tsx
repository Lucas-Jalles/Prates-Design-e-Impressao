import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { FlyToCartProvider } from "@/lib/flyToCart";
import BottomNav from "@/components/BottomNav";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Catálogo Gráfica Prates",
  description: "Catálogo digital de serviços de impressão e design - finalize pelo WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <CartProvider>
          <FlyToCartProvider>
            <main className="flex-1 pb-20">{children}</main>
            <BottomNav />
          </FlyToCartProvider>
        </CartProvider>
      </body>
    </html>
  );
}