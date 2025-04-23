import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/components/reuseable/Provider";
import { Toaster } from 'react-hot-toast';

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "900"],
});

export const metadata: Metadata = {
  title: "Social App",
  description: "A modern social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} antialiased`}
      >
        <Toaster position="top-right" />  
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

