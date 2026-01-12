import { useState } from "react";

const machines = [
  { code: "NEG01" },
  { code: "NEG02" },
  { code: "NEG03" },
  { code: "NEG04" },
  { code: "YEDEK" }
];

export default function App() {
  const [session, setSession] = useState("Sabah");

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Diyaliz Planlama Sistemi</h1>

      {/* ÜST KONTROLLER */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setSession("Sabah")}
          style={{ marginRight: 10, background: session === "Sabah" ? "#4caf50" : "#ccc" }}>
          Sabah
        </button>

        <button onClick={() => setSession("Öğle")}
          style={{ background: session === "Öğle" ? "#4caf50" : "#ccc" }}>
          Öğle
        </button>
      </div>

      <h3>Salon 1 – {session} Seansı</h3>

      {/* MAKİNE KARTLARI */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 15
      }}>
        {machines.map((m) => (
          <div key={m.code} style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            background: "#f9f9f9"
          }}>
            <strong>{m.code}</strong>
            <div style={{ marginTop: 10 }}>
              <div>Hasta: —</div>
              <div>DYZ: —</div>
              <div>SLS: —</div>
              <div style={{ marginTop: 5, color: "gray" }}>Boş</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
