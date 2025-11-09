"use client";
import React, { forwardRef } from "react";
import type { Design, Net, PlacedComponent } from "@/lib/components";

function layoutComponents(components: PlacedComponent[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const cols = Math.ceil(Math.sqrt(components.length));
  const cell = 180;
  components.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions[c.id] = { x: 40 + col * cell, y: 60 + row * cell };
  });
  return positions;
}

function netColor(name: string): string {
  if (name === "GND") return "#7a869a";
  if (name === "3V3" || name === "VBUS" || name === "5V") return "#ff8f3f";
  if (name.startsWith("I2C")) return "#2b6cff";
  if (name.startsWith("SPI")) return "#22c55e";
  if (name.startsWith("UART") || name === "PWM") return "#eab308";
  return "#9b59b6";
}

const BlockDiagram = forwardRef<SVGSVGElement, { design: Design; svgId?: string }>(function BlockDiagram(
  { design, svgId = "block-svg" },
  ref
) {
  const positions = layoutComponents(design.components);
  const width = 900;
  const height = Math.max(340, Math.ceil(design.components.length / 4) * 220);

  function centerOf(compId: string) {
    const { x, y } = positions[compId];
    return { cx: x + 80, cy: y + 30 };
  }

  const lines: JSX.Element[] = [];
  design.nets.forEach((net: Net) => {
    const pts = net.connections.map((c) => centerOf(c.componentId));
    if (pts.length < 2) return;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[0];
      const b = pts[i];
      lines.push(
        <line
          key={`${net.name}-${i}`}
          x1={a.cx}
          y1={a.cy}
          x2={b.cx}
          y2={b.cy}
          stroke={netColor(net.name)}
          strokeWidth={2}
          opacity={0.8}
        />
      );
    }
  });

  return (
    <svg id={svgId} ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: "#0e1430", borderRadius: 10, border: "1px solid #1d2a5a" }}>
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {lines}
      {design.components.map((c) => {
        const pos = positions[c.id];
        return (
          <g key={c.id} transform={`translate(${pos.x},${pos.y})`}>
            <rect width={160} height={60} rx={10} fill="#192654" stroke="#2b3f87" filter="url(#shadow)" />
            <text x={80} y={28} textAnchor="middle" fontSize={13} fill="#e6e9f0" fontWeight={700}>
              {c.name}
            </text>
            <text x={80} y={46} textAnchor="middle" fontSize={11} fill="#aab4d6">
              {c.ref}
            </text>
          </g>
        );
      })}
    </svg>
  );
});

export default BlockDiagram;
