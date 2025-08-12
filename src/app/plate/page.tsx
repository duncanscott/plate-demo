'use client';
import { useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MultiWellPicker, PositionFormat } from 'react-well-plates';
import { useLimsStore } from '@/store/limsStore';

export default function PlatePage() {
  const router = useRouter();
  const search = useSearchParams();
  const { selectedWells, setSelectedWells, clearSelection } = useLimsStore();

  // Parse existing selection from URL (?w=A1,B2)
  useEffect(() => {
    const param = search.get('w');
    if (param) {
      const ids = param.split(',').map((s) => s.trim()).filter(Boolean);
      setSelectedWells(ids as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with selection
  useEffect(() => {
    const qs = new URLSearchParams(search.toString());
    if (!selectedWells?.length) {
      qs.delete('w');
    } else {
      qs.set('w', selectedWells.join(','));
    }
    router.replace(`?${qs.toString()}`);
  }, [selectedWells, router, search]);

  const handleWellChange = (wells: any[], _labels: string[]) => {
    setSelectedWells(wells as any);
  };

  const tools = useMemo(() => (
    <section className="tool-section">
      <h2>Plate Tools</h2>
      <button onClick={clearSelection} disabled={!selectedWells?.length}>
        Clear Selection
      </button>
      <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
      <div>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Selection</h3>
        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-word' }}>{JSON.stringify(selectedWells)}</div>
      </div>
    </section>
  ), [selectedWells, clearSelection]);

  return (
    <main className="plate-page">
      {tools}
      <MultiWellPicker
        onChange={handleWellChange}
        positionFormat={PositionFormat.A1}
      />
    </main>
  );
}
