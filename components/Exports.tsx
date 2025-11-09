"use client";
import React from "react";
import type { Design } from "@/lib/components";
import { downloadJSON, downloadSVGById, downloadText } from "@/lib/download";

export default function Exports({ design, blockId, schematicId }: { design: Design; blockId: string; schematicId: string }) {
  const handleNetlist = () => {
    const nets = design.nets.map((n) => ({ name: n.name, connections: n.connections }));
    const parts = design.components.map((c) => ({ ref: c.ref, name: c.name, footprint: c.footprint }));
    const netlist = { parts, nets };
    downloadJSON("netlist.json", netlist);
  };

  const handleSpec = () => downloadJSON("design.json", design);
  const handleSummary = () => downloadText("summary.txt", design.summary);

  return (
    <div className="card">
      <div className="sectionTitle">Exports</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button className="button" onClick={() => downloadSVGById("block-diagram.svg", blockId)}>Download Block Diagram (SVG)</button>
        <button className="button" onClick={() => downloadSVGById("schematic.svg", schematicId)}>Download Schematic (SVG)</button>
        <button className="button" onClick={handleNetlist}>Download Netlist (JSON)</button>
        <button className="button" onClick={handleSpec}>Download Full Design (JSON)</button>
        <button className="button" onClick={handleSummary}>Download Summary (TXT)</button>
      </div>
      <div className="hint">Tip: Press <span className="kbd">Ctrl</span> + <span className="kbd">S</span> on a diagram to save as image in some browsers.</div>
    </div>
  );
}
