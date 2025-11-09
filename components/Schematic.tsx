"use client";
import React, { forwardRef } from "react";
import type { Design } from "@/lib/components";

const Schematic = forwardRef<SVGSVGElement, { design: Design; svgId?: string }>(function Schematic(
  { design, svgId = "schematic-svg" },
  ref
) {
  const width = 900;
  const height = 600;
  const x0 = 40;
  const y0 = 50;

  const mcu = design.components.find((c) => c.kind === "mcu");
  const others = design.components.filter((c) => c.id !== mcu?.id);

  return (
    <svg id={svgId} ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: "#0e1430", borderRadius: 10, border: "1px solid #1d2a5a" }}>
      {mcu && (
        <g transform={`translate(${x0 + 360},${y0 + 140})`}>
          <rect width={200} height={260} fill="#15224b" stroke="#2b3f87" rx={8} />
          <text x={100} y={24} textAnchor="middle" fontSize={13} fill="#e6e9f0" fontWeight={700}>
            {mcu.name}
          </text>
          <text x={100} y={44} textAnchor="middle" fontSize={11} fill="#aab4d6">
            {mcu.ref}
          </text>
          {mcu.pins.slice(0, 8).map((p, i) => (
            <g key={`l-${p}`} transform={`translate(-10, ${64 + i * 22})`}>
              <line x1={0} y1={10} x2={60} y2={10} stroke="#465b9b" />
              <text x={-6} y={14} textAnchor="end" fontSize={10} fill="#c9d2ee">
                {p}
              </text>
            </g>
          ))}
          {mcu.pins.slice(8, 16).map((p, i) => (
            <g key={`r-${p}`} transform={`translate(150, ${64 + i * 22})`}>
              <line x1={0} y1={10} x2={60} y2={10} stroke="#465b9b" />
              <text x={66} y={14} textAnchor="start" fontSize={10} fill="#c9d2ee">
                {p}
              </text>
            </g>
          ))}
        </g>
      )}

      {others.map((c, idx) => (
        <g key={c.id} transform={`translate(${x0 + (idx % 3) * 260}, ${y0 + Math.floor(idx / 3) * 160})`}>
          <rect width={200} height={80} fill="#15224b" stroke="#2b3f87" rx={8} />
          <text x={100} y={24} textAnchor="middle" fontSize={12} fill="#e6e9f0" fontWeight={700}>
            {c.name}
          </text>
          <text x={100} y={44} textAnchor="middle" fontSize={10} fill="#aab4d6">
            {c.ref}
          </text>
        </g>
      ))}

      {/* Note: wiring is abstracted in block diagram; schematic here is conceptual */}
    </svg>
  );
});

export default Schematic;
