import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL bağlantısı
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// TABLO OLUŞTUR (yoksa)
await pool.query(`
  CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    salon TEXT,
    seans TEXT,
    cihaz TEXT,
    hasta TEXT,
    dyz TEXT,
    sls TEXT,
    durum TEXT
  )
`);

app.get("/", (req, res) => {
  res.json({ status: "Backend çalışıyor" });
});

// TÜM KAYITLARI GETİR
app.get("/schedule", async (req, res) => {
  const result = await pool.query("SELECT * FROM schedule");
  res.json(result.rows);
});

// KAYDET / GÜNCELLE
app.post("/schedule", async (req, res) => {
  const { salon, seans, cihaz, hasta, dyz, sls, durum } = req.body;

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend çalışıyor:", PORT);
});
