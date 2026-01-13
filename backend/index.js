import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL bağlantısı (Render uyumlu)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Başlangıçta tabloyu hazırla
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schedule (
      id SERIAL PRIMARY KEY,
      salon TEXT NOT NULL,
      seans TEXT NOT NULL,
      cihaz TEXT NOT NULL,
      hasta TEXT,
      dyz TEXT,
      sls TEXT,
      durum TEXT,
      UNIQUE (salon, seans, cihaz)
    )
  `);

  console.log("✅ schedule tablosu hazır");
}

// SAĞLIK KONTROLÜ
app.get("/", (req, res) => {
  res.json({ status: "Backend çalışıyor" });
});

// TÜM KAYITLAR
app.get("/schedule", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM schedule ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Veri alınamadı" });
  }
});

// KAYDET / GÜNCELLE
app.post("/schedule", async (req, res) => {
  const { salon, seans, cihaz, hasta, dyz, sls, durum } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO schedule (salon, seans, cihaz, hasta, dyz, sls, durum)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (salon, seans, cihaz)
      DO UPDATE SET
        hasta = EXCLUDED.hasta,
        dyz = EXCLUDED.dyz,
        sls = EXCLUDED.sls,
        durum = EXCLUDED.durum
      `,
      [salon, seans, cihaz, hasta, dyz, sls, durum]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kayıt başarısız" });
  }
});

// SERVER BAŞLAT
const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("🚀 Backend çalışıyor, port:", PORT);
  });
});
