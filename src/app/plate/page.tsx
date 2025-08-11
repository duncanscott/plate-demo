'use client';

import { useState } from 'react';
import { MultiWellPicker, PositionFormat } from 'react-well-plates';

export default function PlatePage() {
  const [selectedWells, setSelectedWells] = useState<number[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const handleWellChange = (wells: number[], labels: string[]) => {
    setSelectedWells(wells);
    setSelectedLabels(labels);
  };

  return (
    <section style={{ display: "grid", gap: "2rem", padding: "1rem" }}>
      <div>
        <h2>Well Plate Picker Demo</h2>
        <p>
          This is a demo of the WellPicker component. Click and drag to select wells.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <h3>96-Well Plate (8×12)</h3>
        <MultiWellPicker
          rows={8}
          columns={12}
          format={PositionFormat.LetterNumber}
          value={selectedWells}
          onChange={handleWellChange}
          wellSize={30}
          rangeSelectionMode="zone"
          disabled={[0, 1, 2]} // Disable first few wells as example
        />
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <h3>24-Well Plate (4×6)</h3>
        <MultiWellPicker
          rows={4}
          columns={6}
          format={PositionFormat.LetterNumber}
          value={[]}
          onChange={() => {}} // Independent picker
          wellSize={40}
          rangeSelectionMode="rows"
        />
      </div>

      {selectedWells.length > 0 && (
        <div style={{ 
          background: "var(--panel)", 
          border: "1px solid var(--border)", 
          borderRadius: "0.5rem", 
          padding: "1rem" 
        }}>
          <h3>Selected Wells</h3>
          <p><strong>Indices:</strong> {selectedWells.join(', ')}</p>
          <p><strong>Labels:</strong> {selectedLabels.join(', ')}</p>
          <p><strong>Count:</strong> {selectedWells.length}</p>
        </div>
      )}

      <div style={{ 
        background: "var(--panel)", 
        border: "1px solid var(--border)", 
        borderRadius: "0.5rem", 
        padding: "1rem",
        fontSize: "0.9rem",
        color: "var(--muted)"
      }}>
        <h4>Usage Tips:</h4>
        <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
          <li>Click individual wells to select/deselect</li>
          <li>Click and drag to select rectangular zones</li>
          <li>Gray wells are disabled and cannot be selected</li>
          <li>Different plates support different selection modes (zone, rows, columns)</li>
        </ul>
      </div>
    </section>
  );
}