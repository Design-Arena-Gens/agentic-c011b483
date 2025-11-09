"use client";
import React from "react";
import type { Design } from "@/lib/components";

function aggregate(design: Design) {
  const map = new Map<string, { qty: number; cost: number }>();
  for (const c of design.components) {
    const v = map.get(c.name) ?? { qty: 0, cost: 0 };
    v.qty += 1;
    v.cost += c.cost;
    map.set(c.name, v);
  }
  const rows = [...map.entries()].map(([name, v]) => ({ name, qty: v.qty, unit: v.cost / v.qty, total: v.cost }));
  const totalCost = rows.reduce((s, r) => s + r.total, 0);
  return { rows, totalCost };
}

export default function BomTable({ design }: { design: Design }) {
  const { rows, totalCost } = aggregate(design);
  return (
    <div className="card">
      <div className="sectionTitle">Bill of Materials</div>
      <table className="table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Qty</th>
            <th>Unit ($)</th>
            <th>Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>{r.qty}</td>
              <td>{r.unit.toFixed(2)}</td>
              <td>{r.total.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={{ textAlign: "right", fontWeight: 700 }}>Grand Total</td>
            <td style={{ fontWeight: 700 }}>${totalCost.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
