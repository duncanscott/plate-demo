export default function Page() {
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
