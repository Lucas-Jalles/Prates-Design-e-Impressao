<<<<<<< HEAD
import type { Metadata, Viewport } from "next";
=======
import type { Metadata } from "next";
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { FlyToCartProvider } from "@/lib/flyToCart";
import BottomNav from "@/components/BottomNav";
<<<<<<< HEAD
import SWRegister from "@/components/SWRegister";
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Catálogo Gráfica Prates",
  description: "Catálogo digital de serviços de impressão e design - finalize pelo WhatsApp",
<<<<<<< HEAD
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prates Gráfica",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon-192.png",
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E9BE0",
  width: "device-width",
  initialScale: 1,
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
<<<<<<< HEAD
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Prates Gráfica" />
      </head>
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <CartProvider>
          <FlyToCartProvider>
            <main className="flex-1 pb-20">{children}</main>
            <BottomNav />
<<<<<<< HEAD
            <SWRegister />
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
          </FlyToCartProvider>
        </CartProvider>
      </body>
    </html>
  );
}