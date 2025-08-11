import "./globals.css";
import { IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/utils/misc";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sophie Lin",
  icons: {
    icon: "/favicon/star-black.png",
  },
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  preload: true,
  adjustFontFallback: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        ibmPlexMono.variable,
        "bg-background text-foreground",
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-gray-400/20",
        "[&::-webkit-scrollbar-thumb]:rounded-full"
      )}
    >
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/star-white.png"
          id="favicon"
        />
        <link rel="icon" href="data:," />
      </head>
      <body className="antialiased font-mono overflow-x-hidden">
        <div className="min-h-screen relative">{children}</div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
