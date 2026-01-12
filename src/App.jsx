import { useState } from "react";

const machines = ["NEG01", "NEG02", "NEG03", "NEG04", "YEDEK"];

const emptyData = machines.reduce((acc, m) => {
  acc[m] = { hasta: "", dzy: "", sls: "", durum: "Boş" };
  return acc;
}, {});

export default function App() {
  const [session, setSession] = useState("Sabah");
  const [data, setData] = useState({
    Sabah: JSON.parse(JSON.stringify(emptyData)),
    Öğle: JSON.parse(JSON.stringify(emptyData))
  });

  const update = (machine, field, value) => {
    setData(prev => ({
      ...prev,
      [session]: {
        ...prev[session],
        [machine]: {
          ...prev[session][machine],
          [field]: value,
          durum: value ? "Aktif" : "Boş"
        }
      }
    }));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Diyaliz Planlama Sistemi</h1>

      {/* SEANS */}
      <div style={{ marginBottom: 20 }}>
        {["Sabah", "Öğle"].map(s => (
          <button
            key={s}
            onClick={() => setSession(s)}
            style={{
              marginRight: 10,
              background: session === s ? "#4caf50" : "#ccc"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <h3>Salon 1 – {session} Seansı</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 15
      }}>
        {machines.map(m => {
          const item = data[session][m];
          return (
            <div key={m} style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
              background: item.durum === "Aktif" ? "#e8f5e9" : "#f9f9f9"
            }}>
              <strong>{m}</strong>

              <div style={{ marginTop: 8 }}>
                <input
                  placeholder="Hasta adı"
                  value={item.hasta}
                  onChange={e => update(m, "hasta", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />

                <select
                  value={item.dzy}
                  onChange={e => update(m, "dzy", e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                >
                  <option value="">DYZ</option>
                  <option value="1.4">1.4</option>
                  <option value="2.0">2.0</option>
                  <option value="2.1H">2.1H</option>
                </select>

                <select
                  value={item.sls}
                  onChange={e => update(m, "sls", e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="">SLS</option>
                  <option value="K2/1.25">K2 / 1.25</option>
                  <option value="K2/1.50">K2 / 1.50</option>
                  <option value="K2/1.75">K2 / 1.75</option>
                </select>

                <div style={{ marginTop: 6, fontSize: 12 }}>
                  Durum: <strong>{item.durum}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
