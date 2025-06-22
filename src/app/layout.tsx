import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { CallToAction } from "@/components/CallToAction";
import { RealFooter } from "@/components/RealFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Аналитика стримов Olesha",
  description: "Подробный анализ и инсайты по стримам",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <ConditionalHeader />
          <main className="flex-1">{children}</main>
          <CallToAction />
          <RealFooter />
        </div>
      </body>
    </html>
  );
}
