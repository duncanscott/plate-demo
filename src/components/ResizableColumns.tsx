"use client";

import React from "react";

type Props = {
    tools: React.ReactNode;
    children: React.ReactNode;
    /** Server + first client render width to avoid hydration mismatch */
    defaultWidth?: number;
    /** Min/Max width in px */
    min?: number;
    max?: number;
    /** localStorage key to persist */
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
    const draggingRef = React.useRef(false);

    // Render same width on server and initial client paint
    const [width, setWidth] = React.useState<number>(defaultWidth);

    // After mount, hydrate from localStorage (if available)
    React.useEffect(() => {
        try {
            const saved = window.localStorage.getItem(storageKey);
            if (saved) {
                const n = Number(saved);
                if (!Number.isNaN(n)) setWidth(clamp(n, min, max));
            }
        } catch {
            /* ignore */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist width on change (post-mount)
    React.useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, String(width));
        } catch {
            /* ignore */
        }
    }, [width, storageKey]);

    function startDrag() {
        draggingRef.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }

    function stopDrag() {
        draggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }

    React.useEffect(() => {
        function onMove(clientX: number) {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = clientX - rect.left;
            setWidth((_) => clamp(x, min, max));
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

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", stopDrag);
        window.addEventListener("touchcancel", stopDrag); // ensure cleanup on cancel

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", stopDrag);
            window.removeEventListener("touchcancel", stopDrag);
        };
    }, [min, max]);

    function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        const step = e.shiftKey ? 20 : 10;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            setWidth((w) => clamp(w - step, min, max));
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setWidth((w) => clamp(w + step, min, max));
        } else if (e.key === "Home") {
            e.preventDefault();
            setWidth(min);
        } else if (e.key === "End") {
            e.preventDefault();
            setWidth(max);
        } else if (e.key === "Escape") {
            e.preventDefault();
            stopDrag(); // cancel any drag state
        }
    }

    return (
        <div
            ref={containerRef}
            className="content"
            // CSS owns the grid; we only provide the current width value
            style={{ ["--sidebar-px" as any]: `${width}px` }}
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
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={Math.round(width)}
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

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}
