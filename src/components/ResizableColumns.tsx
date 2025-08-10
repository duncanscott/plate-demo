"use client";

import React from "react";

type Props = {
  tools: React.ReactNode;
  children: React.ReactNode;
  /** starting width in px if nothing in localStorage */
  defaultWidth?: number;
  /** min/max in px */
  min?: number;
  max?: number;
  /** storage key to persist user preference */
  storageKey?: string;
};

export default function ResizableColumns({
  tools,
  children,
  defaultWidth = 320,
  min = 220,
  max = 800,
  storageKey = "sidebarWidth",
}: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const n = Number(saved);
        if (!Number.isNaN(n)) return n;
      }
    }
    return defaultWidth;
  });
  const draggingRef = React.useRef(false);

  React.useEffect(() => {
    // persist on change (debounced-ish by React batching)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, String(width));
    }
  }, [width, storageKey]);

  React.useEffect(() => {
    function onMove(clientX: number) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left; // distance from container left
      const next = Math.min(Math.max(x, min), max);
      setWidth(next);
    }
    function handleMouseMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      e.preventDefault();
      onMove(e.clientX);
    }
    function handleTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return;
      if (e.touches[0]) onMove(e.touches[0].clientX);
    }
    function stop() {
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stop);
    };
  }, [min, max]);

  function startDrag() {
    draggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 20 : 10;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setWidth((w) => Math.max(min, w - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setWidth((w) => Math.min(max, w + step));
    }
  }

  return (
    <div
      ref={containerRef}
      className="content"
      style={{ gridTemplateColumns: `${width}px minmax(0, 1fr)` }}
    >
      <aside className="tools" aria-label="Tools sidebar">
        {tools}
      </aside>

      {/* Drag handle between columns */}
      <div
        className="resize-handle"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        tabIndex={0}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onKeyDown={onKeyDown}
      />

      <main className="main" role="main">
        {children}
      </main>
    </div>
  );
}
