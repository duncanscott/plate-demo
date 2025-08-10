export default function Page() {
  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <h2>Dashboard</h2>
      <p>
        Scroll this page — the header remains at the top and the tools panel
        sticks beneath it on the left.
      </p>
      <div
        style={{
          height: 1200,
          border: "1px dashed #1f2937",
          borderRadius: 12,
          padding: 16,
        }}
      >
        Tall content to demonstrate sticky behavior.
      </div>
    </section>
  );
}
