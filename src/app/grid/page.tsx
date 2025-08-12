'use client';
import { useState } from 'react';
import CSVToolbar from '@/components/CSVToolbar';

export default function GridPage() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  const handleImport = (incoming: Record<string, any>[]) => {
    setRows(incoming);
  };

  return (
    <main>
      <h1>Grid</h1>
      <div style={{ margin: '0.5rem 0' }}>
        <CSVToolbar rows={rows} onImport={handleImport} />
      </div>
      {/* your grid component here, driven by `rows` */}
      {/* Example: <MyGlideGrid rows={rows} onRowsChange={setRows} /> */}
    </main>
  );
}
