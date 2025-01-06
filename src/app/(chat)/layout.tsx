import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "900"]
});



export const metadata: Metadata = {
  title: "Talk to Tabetai - What do you want to eat?",
  description: "AI Agent for finding recipes and cooking instructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/assets/cake.svg" type="image/svg+xml" />
      </head>
      <body
      className={`${nunito.variable} antialiased`}
      >
        <div className="h-screen flex flex-col max-w-[1200px] mx-auto">
            {children}
        </div>
      </body>
    </html>
  );
}
