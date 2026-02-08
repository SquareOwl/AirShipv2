"use client";

import { useState } from "react";

type PackageRow = {
  id: number;
};

export default function PackagesInput() {
  const [rows, setRows] = useState<PackageRow[]>([{ id: 1 }]);

  function addRow() {
    setRows((current) => [...current, { id: Date.now() }]);
  }

  function removeRow(id: number) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((row, index) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span>Weight (lbs)</span>
            <input
              name="packageWeightLbs"
              type="number"
              step="0.01"
              required={index === 0}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Length (in)</span>
            <input name="packageLengthIn" type="number" step="0.01" />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Width (in)</span>
            <input name="packageWidthIn" type="number" step="0.01" />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Height (in)</span>
            <input name="packageHeightIn" type="number" step="0.01" />
          </label>
          <button
            type="button"
            onClick={() => removeRow(row.id)}
            disabled={rows.length === 1}
            style={{ height: 36 }}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addRow} style={{ width: 140 }}>
        Add package
      </button>
    </div>
  );
}
