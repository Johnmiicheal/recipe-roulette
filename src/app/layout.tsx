import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/components/ChatContext";
import { Analytics } from "@vercel/analytics/react";

const nunito = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "900"],
});

export const metadata: Metadata = {
  title: "Talk to Tabetai - What do you want to eat?",
  description:
    "AI Agent for finding recipes and cooking instructions with relevant youtube videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <html lang="en">
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
          <link rel="icon" href="/assets/cake.svg" type="image/svg+xml" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Tabetai - Everybody can cook" />
          <meta
            property="og:description"
            content="AI Agent for finding recipes and cooking instruction with relevant youtube videos."
          />
          <meta property="og:site_name" content="Tabetai" />
          <meta property="og:url" content="https://trytabetai.vercel.app" />
          <meta property="og:image" content="/thumbnail.png" />
        </head>
        <body className={`${nunito.variable} antialiased`}>
          <div className="h-screen flex flex-col mx-auto">
            {children}
            <Analytics />
          </div>
        </body>
      </html>
    </ChatProvider>
  );
}
