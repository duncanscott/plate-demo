'use client';

import { useTools } from "@/components/layout/ToolsContext";

export default function Page() {
  useTools(
    <section className="tool-section">
      <h2>Dashboard Tools</h2>
      <button>New Project</button>
      <button>Import Data</button>
      <button>Export</button>
      <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
      <div>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Quick Actions</h3>
        <button style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          Recent Projects
        </button>
        <button style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          Templates
        </button>
      </div>
    </section>
  );

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <h2>Dashboard</h2>
      <p>
        Try dragging the vertical divider — the left tools panel resizes, the header stays sticky, and only this main panel scrolls.
      </p>
      <div
        style={{
          height: 1200,
          border: "1px dashed #1f2937",
          borderRadius: 12,
          padding: 16,
        }}
      >
        Tall content to demonstrate scrolling.
      </div>
    </section>
  );
}
