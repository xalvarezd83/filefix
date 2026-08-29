import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FileFix",
  description: "Turn messy spreadsheets into upload-ready data."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
