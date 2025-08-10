import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import ResizableColumns from "@/components/layout/ResizableColumns";

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
        <div className="shell">
          <header className="header">
            <h1>My App</h1>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </nav>
          </header>

          <ResizableColumns
            tools={
              <section className="tool-section">
                <h2>Tools</h2>
                <button>Action</button>
                <button>Another</button>
              </section>
            }
          >
            {children}
          </ResizableColumns>
        </div>
      </body>
    </html>
  );
}
