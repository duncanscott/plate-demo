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
    const handleRef = React.useRef<HTMLDivElement | null>(null);
    const draggingRef = React.useRef(false);
    const pointerIdRef = React.useRef<number | null>(null);

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

    // Helper for position -> width
    const updateFromClientX = React.useCallback(
        (clientX: number) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = clientX - rect.left;
            setWidth((_) => clamp(x, min, max));
        },
        [min, max]
    );

    // Start drag via Pointer Events
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // Only left button or touch/pen; ignore right click etc.
        if (e.button !== 0 && e.pointerType === "mouse") return;

        draggingRef.current = true;
        pointerIdRef.current = e.pointerId;

        // Capture pointer so we continue receiving events even if the pointer leaves the handle
        try {
            handleRef.current?.setPointerCapture(e.pointerId);
        } catch {
            // Some browsers may throw if capture is not supported—safe to ignore
        }

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        updateFromClientX(e.clientX);
    };

    // Global listeners for pointer move/up/cancel
    React.useEffect(() => {
        function handlePointerMove(e: PointerEvent) {
            if (!draggingRef.current) return;
            // Prevent page scrolling on touch while dragging (touch-action: none on the handle helps too)
            e.preventDefault?.();
            updateFromClientX(e.clientX);
        }

        function stopDrag(e?: PointerEvent) {
            if (!draggingRef.current) return;
            draggingRef.current = false;

            // Release capture if we own it
            const id = pointerIdRef.current;
            if (id != null) {
                try {
                    handleRef.current?.releasePointerCapture(id);
                } catch {
                    /* ignore */
                }
            }
            pointerIdRef.current = null;

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }

        window.addEventListener("pointermove", handlePointerMove, { passive: false });
        window.addEventListener("pointerup", stopDrag);
        window.addEventListener("pointercancel", stopDrag);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopDrag);
            window.removeEventListener("pointercancel", stopDrag);
        };
    }, [updateFromClientX]);

    // Keyboard resizing + ESC to cancel
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
            // End any active drag
            if (draggingRef.current) {
                draggingRef.current = false;
                const id = pointerIdRef.current;
                if (id != null) {
                    try {
                        handleRef.current?.releasePointerCapture(id);
                    } catch {/* ignore */}
                }
                pointerIdRef.current = null;
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
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
                ref={handleRef}
                className="resize-handle"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={Math.round(width)}
                tabIndex={0}
                onPointerDown={onPointerDown}
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
