import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

/* === DATABASE KONTROL === */
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL tanımlı değil");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* === DB INIT (CRASH OLMASIN DİYE TRY/CATCH) === */
async function initDB() {
  try {
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
    console.log("✅ schedule tablosu hazır");
  } catch (err) {
    console.error("❌ DB init hatası:", err.message);
  }
}

initDB();

/* === ROUTES === */
app.get("/", (req, res) => {
  res.json({ status: "Backend çalışıyor" });
});

app.get("/schedule", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM schedule");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/schedule", async (req, res) => {
  const { salon, seans, cihaz, hasta, dyz, sls, durum } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO schedule (salon, seans, cihaz, hasta, dyz, sls, durum)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [salon, seans, cihaz, hasta, dyz, sls, durum]
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Backend çalışıyor, port:", PORT);
});
