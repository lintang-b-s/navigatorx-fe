import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NavigatorX",
  description: "osm routing engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className}  antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster position="top-center" />
        </Suspense>
      </body>
    </html>
  );
}
