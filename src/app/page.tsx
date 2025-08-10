export default function Page() {
  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <h2>Dashboard</h2>
      <p>
        This is the main content area. It will occupy all space to the right of
        the tools panel under the header.
      </p>
      <div style={{ height: 800, border: "1px dashed #1f2937", borderRadius: 12, padding: 16 }}>
        Tall content to demonstrate scrolling behavior.
      </div>
    </section>
  );
}
