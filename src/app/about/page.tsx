'use client';

import { useTools } from "@/components/layout/ToolsContext";

export default function AboutPage() {
  useTools(
    <section className="tool-section">
      <h2>About Tools</h2>
      <div>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Information</h3>
        <button style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          Documentation
        </button>
        <button style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          GitHub Repo
        </button>
        <button style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          Report Issue
        </button>
      </div>
    </section>
  );

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <h2>About</h2>
      <p>Placeholder page for testing navigation.</p>
    </section>
  );
}
