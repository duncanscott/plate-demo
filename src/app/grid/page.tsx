'use client';

import { useMemo, useState, useCallback } from 'react';
import DataEditor, { GridCell, GridCellKind } from '@glideapps/glide-data-grid';
import CSVToolbar from '@/components/CSVToolbar';

type Row = Record<string, any>;

export default function GridPage() {
    const [rows, setRows] = useState<Row[]>([]);

    // Derive column list from the first row (or show a default empty column)
    const columns = useMemo(() => {
        const keys = rows.length ? Object.keys(rows[0]) : [''];
        return keys.map((k) => ({ title: k }));
    }, [rows]);

    // Cell renderer
    const getCellContent = useCallback(
        ([col, row]): GridCell => {
            // guard
            if (!rows.length || row >= rows.length) {
                return {
                    kind: GridCellKind.Text,
                    data: '',
                    displayData: '',
                    allowOverlay: false,
                };
            }
            const key = columns[col]?.title ?? '';
            const value = (rows[row]?.[key] ?? '') as string;
            return {
                kind: GridCellKind.Text,
                data: String(value ?? ''),
                displayData: String(value ?? ''),
                allowOverlay: true,
            };
        },
        [rows, columns]
    );

    // Handle inline edits
    const onCellEdited = useCallback(
        (location: readonly [number, number], newValue: GridCell) => {
            const [col, row] = location;
            const key = columns[col]?.title;
            if (!key || newValue.kind !== GridCellKind.Text) return;
            setRows((prev) => {
                const next = [...prev];
                next[row] = { ...next[row], [key]: newValue.data };
                return next;
            });
        },
        [columns]
    );

    // CSV import handler
    const handleImport = (incoming: Row[]) => {
        // Normalize keys (PapaParse returns strings; keep as-is)
        setRows(incoming);
    };

    // Minimal empty-state sample
    const loadSample = () =>
        setRows([
            { SampleID: 'S-001', Type: 'Control', Volume: 10 },
            { SampleID: 'S-002', Type: 'DNA', Volume: 8 },
            { SampleID: 'S-003', Type: 'RNA', Volume: 5 },
        ]);

    return (
        <main style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
            <h1>Grid</h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <CSVToolbar rows={rows} onImport={handleImport} />
                {!rows.length && (
                    <button onClick={loadSample} title="Load a tiny sample so the grid appears">
                        Load sample data
                    </button>
                )}
            </div>

            <div
                style={{
                    height: '70vh', // adjust as you like
                    minHeight: 300,
                    border: '1px solid var(--border, #ddd)',
                    borderRadius: 8,
                    overflow: 'hidden',
                }}
            >
                <DataEditor
                    columns={columns}
                    getCellContent={getCellContent}
                    rows={rows.length || 1}
                    onCellEdited={onCellEdited}
                    smoothScrollX
                    smoothScrollY
                    rowMarkers="number"
                    rowHeight={28}
                />
            </div>
        </main>
    );
}
