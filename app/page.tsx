"use client";
import React, { useMemo, useRef, useState } from "react";
import { synthesizeDesign, detectFeatures } from "@/lib/synthesize";
import type { Design } from "@/lib/components";
import BlockDiagram from "@/components/BlockDiagram";
import Schematic from "@/components/Schematic";
import BomTable from "@/components/BomTable";
import Exports from "@/components/Exports";

export default function Page() {
  const [input, setInput] = useState("GPS + temperature logging with battery, USB-C and OLED display. WiFi sync.");
  const [design, setDesign] = useState<Design | null>(null);
  const [tab, setTab] = useState<"block" | "schem">("block");

  const blockId = "block-svg";
  const schematicId = "schematic-svg";

  const onGenerate = () => {
    const d = synthesizeDesign(input);
    setDesign(d);
  };

  const featureChips = useMemo(() => {
    const feats = detectFeatures(input);
    return Object.entries(feats).map(([k, v]) => (
      <span key={k} className="kbd" style={{ background: v ? "#11225a" : undefined, borderColor: v ? "#2b6cff" : undefined }}>
        {k}
      </span>
    ));
  }, [input]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand">Agentic E-Designer</div>
        <div className="small">No login. 100% free. Text ? Design.</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="sectionTitle">Requirements</div>
        <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Aap apni product ki requirements Hindi/English mein type kijiye. Example: 'Battery powered soil moisture sensor with WiFi and temperature logging via microSD'" />
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{featureChips}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="button" onClick={onGenerate}>Design</button>
            <button className="button" onClick={() => { setDesign(null); setInput(""); }}>Reset</button>
          </div>
        </div>
      </div>

      {design ? (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="sectionTitle">Overview</div>
            <div style={{ opacity: 0.9 }}>{design.summary}</div>
          </div>

          <div className="tabs">
            <button className={`tab ${tab === "block" ? "active" : ""}`} onClick={() => setTab("block")}>Block Diagram</button>
            <button className={`tab ${tab === "schem" ? "active" : ""}`} onClick={() => setTab("schem")}>Schematic</button>
          </div>

          {tab === "block" ? (
            <div className="card"><BlockDiagram design={design} svgId={blockId} /></div>
          ) : (
            <div className="card"><Schematic design={design} svgId={schematicId} /></div>
          )}

          <div className="grid">
            <BomTable design={design} />
            <Exports design={design} blockId={blockId} schematicId={schematicId} />
          </div>
        </>
      ) : (
        <div className="card">
          <div className="sectionTitle">How it works</div>
          <div style={{ lineHeight: 1.6 }}>
            Type your requirements (Hindi/English). The tool detects features like WiFi, GPS, sensors, battery/USB power, storage and more; then it selects suitable components, generates a connection netlist, a conceptual block diagram, a simplified schematic, and a BOM. You can export SVG diagrams and JSON netlists.
          </div>
        </div>
      )}

      <hr />
      <div className="small">Disclaimer: This is a conceptual design assistant. Always verify with an EDA tool (KiCad) before manufacturing.</div>
    </div>
  );
}
