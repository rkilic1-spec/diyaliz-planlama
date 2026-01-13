import { useState, useEffect } from "react";
const API_URL = "https://diyaliz-planlama-1.onrender.com";

const machines = ["NEG01", "NEG02", "NEG03", "NEG04", "YEDEK"];
const salons = ["Salon 1", "Salon 2"];
const sessions = ["Sabah", "Öğle"];

const statusColors = {
  Boş: "#f9f9f9",
  Aktif: "#e8f5e9",
  Gelmedi: "#ffebee",
  Ex: "#eeeeee",
  Yedek: "#e3f2fd",
  Arızalı: "#fff3e0"
};

const createEmpty = () =>
  salons.reduce((salonAcc, salon) => {
    salonAcc[salon] = sessions.reduce((sessAcc, sess) => {
      sessAcc[sess] = machines.reduce((mAcc, m) => {
        mAcc[m] = { hasta: "", dzy: "", sls: "", durum: "Boş" };
        return mAcc;
      }, {});
      return sessAcc;
    }, {});
    return salonAcc;
  }, {});

export default function App() {
  const [salon, setSalon] = useState("Salon 1");
  const [session, setSession] = useState("Sabah");
  const [data, setData] = useState(createEmpty());
  useEffect(() => {
  fetch(`${API_URL}/schedule`)
    .then(res => res.json())
    .then(rows => {
      console.log("Backend'den gelen kayıtlar:", rows);
    });
}, []);

  const [dragged, setDragged] = useState(null);

  const update = (machine, newData) => {
    setData(prev => ({
      ...prev,
      [salon]: {
        ...prev[salon],
        [session]: {
          ...prev[salon][session],
          [machine]: newData
        }
      }
    }));
  };

  const onDrop = (target) => {
    if (!dragged || dragged === target) return;

    const sourceData = data[salon][session][dragged];
    const targetData = data[salon][session][target];

    if (!sourceData.hasta) return;
    if (targetData.hasta) {
      alert("Bu makine dolu!");
      return;
    }
    if (targetData.durum === "Arızalı") {
      alert("Makine arızalı!");
      return;
    }

    update(target, { ...sourceData, durum: "Aktif" });
    update(dragged, { hasta: "", dzy: "", sls: "", durum: "Boş" });
    setDragged(null);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Diyaliz Planlama Sistemi</h1>

      <div style={{ marginBottom: 15 }}>
        {sessions.map(s => (
          <button key={s} onClick={() => setSession(s)}
            style={{ marginRight: 5, background: session === s ? "#4caf50" : "#ccc" }}>
            {s}
          </button>
        ))}
        {salons.map(sl => (
          <button key={sl} onClick={() => setSalon(sl)}
            style={{ marginLeft: 10, background: salon === sl ? "#1976d2" : "#ccc", color: "white" }}>
            {sl}
          </button>
        ))}
      </div>

      <h3>{salon} – {session} Seansı</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 15
      }}>
        {machines.map(m => {
          const item = data[salon][session][m];
          return (
            <div
              key={m}
              draggable={!!item.hasta}
              onDragStart={() => setDragged(m)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(m)}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                background: statusColors[item.durum],
                cursor: item.hasta ? "grab" : "default"
              }}
            >
              <strong>{m}</strong>

              <input
                placeholder="Hasta adı"
                value={item.hasta}
                onChange={e => update(m, { ...item, hasta: e.target.value })}
                style={{ width: "100%", marginTop: 6 }}
              />

              <select
                value={item.dzy}
                onChange={e => update(m, { ...item, dzy: e.target.value })}
                style={{ width: "100%", marginTop: 5 }}
              >
                <option value="">DYZ</option>
                <option value="1.4">1.4</option>
                <option value="2.0">2.0</option>
                <option value="2.1H">2.1H</option>
              </select>

              <select
                value={item.sls}
                onChange={e => update(m, { ...item, sls: e.target.value })}
                style={{ width: "100%", marginTop: 5 }}
              >
                <option value="">SLS</option>
                <option value="K2/1.25">K2 / 1.25</option>
                <option value="K2/1.50">K2 / 1.50</option>
                <option value="K2/1.75">K2 / 1.75</option>
              </select>

              <div style={{ marginTop: 5, fontSize: 12 }}>
                Durum: <strong>{item.durum}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
