import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "App with Tool Sidebar",
  description: "Header + left tool area + main content layout",
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

          <div className="content">
            <aside className="tools" aria-label="Tools sidebar">
              <section className="tool-section">
                <h2>Tools</h2>
                <button>Action</button>
                <button>Another</button>
              </section>
            </aside>

            <main className="main" role="main">
              {children}
            </main>
          </div>

          <footer className="footer">
            <small>© {new Date().getFullYear()} My Company</small>
          </footer>
        </div>
      </body>
    </html>
  );
}
