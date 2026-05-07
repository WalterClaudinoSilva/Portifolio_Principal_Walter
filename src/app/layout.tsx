import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SeasonalDecoration from "@/components/SeasonalDecoration";

import { prisma } from "@/lib/prisma";
import { getActiveTheme } from "@/lib/theme-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const profile = await prisma.profile.findFirst({
    where: { id: "default-profile" },
  });

  return {
    title: profile ? `${profile.name} | Portfólio Profissional` : "Walter Claudino | Portfólio Profissional",
    description: profile?.title || "Professor EBTT do IFAM, Especialista em IA, IoT e Visão Computacional",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { themeId, message } = await getActiveTheme();

  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`} data-theme={themeId}>
      <body className="bg-bg-dark text-white antialiased">
        <NextAuthProvider>
          <AnalyticsTracker />
          <SeasonalDecoration message={message} />
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
