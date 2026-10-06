import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://e-learning-research.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "TechLearn | Media Pembelajaran Teknik Mesin",
    template: "%s | TechLearn",
  },

  description:
    "Platform media pembelajaran berbasis web untuk membantu siswa memahami materi Teknik Mesin melalui materi terstruktur dan video pembelajaran visual.",

  keywords: [
    "pembelajaran teknik mesin",
    "media pembelajaran teknik mesin",
    "e-learning teknik mesin",
    "pendidikan teknik mesin",
    "pembelajaran berbasis video",
    "media pembelajaran berbasis web",
  ],

  authors: [
    {
      name: "TechLearn",
    },
  ],

  creator: "TechLearn",

  applicationName: "TechLearn",

  category: "education",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "TechLearn",
    title: "TechLearn | Media Pembelajaran Teknik Mesin",
    description:
      "Platform media pembelajaran berbasis web dengan materi terstruktur dan video pembelajaran visual untuk siswa Teknik Mesin.",
  },

  twitter: {
    card: "summary_large_image",
    title: "TechLearn | Media Pembelajaran Teknik Mesin",
    description:
      "Media pembelajaran berbasis web untuk siswa Teknik Mesin melalui materi dan video pembelajaran visual.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}