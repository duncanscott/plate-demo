"use client";

import React from "react";

type Props = {
    tools: React.ReactNode;
    children: React.ReactNode;
    defaultWidth?: number;   // server+first client render width
    min?: number;
    max?: number;
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

    // Render the same value on server and initial client render
    const [width, setWidth] = React.useState<number>(defaultWidth);

    // After mount, hydrate from localStorage (if present)
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

    // Persist on change (after mount)
    React.useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, String(width));
        } catch {
            /* ignore */
        }
    }, [width, storageKey]);

    const draggingRef = React.useRef(false);

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
            setWidth((w) => clamp(w - step, min, max));
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setWidth((w) => clamp(w + step, min, max));
        }
    }

    return (
        <div
            ref={containerRef}
            className="content"
            // CSS owns the grid template; we only feed the number via a CSS var
            style={{ ["--sidebar-px" as any]: `${width}px` }}
        >
            <aside className="tools" aria-label="Tools sidebar">
                {tools}
            </aside>

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

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}
