import * as React from "react";

export type WellPlateProps = {
    rows?: number;
    cols?: number;
};

export function WellPlate({ rows = 8, cols = 12 }: WellPlateProps) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
            {Array.from({ length: rows * cols }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: "1px solid #334155",
                        background: "rgba(255,255,255,0.04)",
                    }}
                    title={`Well ${i + 1}`}
                />
            ))}
        </div>
    );
}
