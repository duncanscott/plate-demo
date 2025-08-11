import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ToolsProvider } from "@/components/layout/ToolsContext";
import LayoutWithTools from "@/components/layout/LayoutWithTools";

export const metadata: Metadata = {
  title: "App with Tool Sidebar",
  description: "Header + resizable left tool area + main content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToolsProvider>
          <div className="shell">
            <header className="header">
              <h1>My App</h1>
              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/plate">Plate Demo</Link>
                <Link href="/grid">Grid</Link>
              </nav>
            </header>

            <LayoutWithTools>
              {children}
            </LayoutWithTools>
          </div>
        </ToolsProvider>
      </body>
    </html>
  );
}
