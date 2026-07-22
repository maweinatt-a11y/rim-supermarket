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

export const metadata: Metadata = {
  title: "RIM Supermarket",
  description:
    "RIM Supermarket هو سوق إلكتروني موريتاني يتيح للمتاجر عرض منتجاتها والتواصل مع العملاء بسهولة عبر واتساب.",
  keywords: [
    "RIM Supermarket",
    "Mauritania",
    "موريتانيا",
    "متجر إلكتروني",
    "تسوق",
    "ملابس",
    "واتساب",
  ],
  verification: {
    google: "MmbxErtefA46AURhbdipv9mS_Vl6SU8G4tl31XVCGpM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}