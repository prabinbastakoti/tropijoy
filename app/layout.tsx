import type { Metadata } from "next";
import { Inter, Baloo_2 } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import CartDrawer from "@/components/cart/CartDrawer";
import PageTransition from "@/components/motion/PageTransition";
import ScrollToTop from "@/components/layout/ScrollToTop";
import AppToaster from "@/components/layout/AppToaster";
import { SITE_URL } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tropijoy — Pure Joy In Every Bite",
    template: "%s · Tropijoy",
  },
  description:
    "Premium dehydrated fruits and freeze-dried fruit powders from Nepal. 100% organic, no added sugar, no preservatives.",
  icons: {
    icon: "/brand/favicon-t-white.png",
  },
  openGraph: {
    title: "Tropijoy — Pure Joy In Every Bite",
    description:
      "Premium dehydrated fruits and freeze-dried fruit powders from Nepal.",
    url: SITE_URL,
    siteName: "Tropijoy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${baloo.variable}`}>
      <body className="font-sans antialiased bg-cream min-h-screen flex flex-col">
        <LoadingScreen />
        <Header />
        <main className="flex-1 pt-[var(--header-h)]">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <CartDrawer />
        <ScrollToTop />
        <AppToaster />
      </body>
    </html>
  );
}
