'use client';
import Papa from 'papaparse';
import { useRef } from 'react';

export interface CSVToolbarProps {
  rows: Record<string, any>[];
  onImport: (rows: Record<string, any>[]) => void;
}

export default function CSVToolbar({ rows, onImport }: CSVToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const exportCsv = () => {
    const csv = Papa.unparse(rows ?? []);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grid-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const res = Papa.parse(text, { header: true, skipEmptyLines: true });
    onImport((res.data as any[]) ?? []);
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={exportCsv}>Export CSV</button>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.tsv,text/csv"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])}
      />
      <button onClick={() => fileRef.current?.click()}>Import CSV</button>
    </div>
  );
}
