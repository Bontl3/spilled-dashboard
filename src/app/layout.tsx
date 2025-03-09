import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Observability",
  description: "Network monitoring and analysis dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
