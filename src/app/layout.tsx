import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LENS Photography",
  description: "Professional Photography Platform",
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32' },
      { url: '/icon.png', sizes: '16x16' },
    ],
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}