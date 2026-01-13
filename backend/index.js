import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("database.db");

// TABLOLAR
db.prepare(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    active INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    salon TEXT,
    session TEXT,
    machine TEXT,
    patient TEXT,
    dialyzer TEXT,
    solution TEXT,
    status TEXT
  )
`).run();

// TEST ENDPOINT
app.get("/", (req, res) => {
  res.json({ status: "Backend çalışıyor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
// GÜNLÜK PLAN GETİR
app.get("/schedule", (req, res) => {
  const rows = db.prepare("SELECT * FROM schedule").all();
  res.json(rows);
});

// GÜNLÜK PLAN KAYDET
app.post("/schedule", (req, res) => {
  const {
    date,
    salon,
    session,
    machine,
    patient,
    dialyzer,
    solution,
    status
  } = req.body;

  db.prepare(`
    INSERT INTO schedule
    (date, salon, session, machine, patient, dialyzer, solution, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    date,
    salon,
    session,
    machine,
    patient,
    dialyzer,
    solution,
    status
  );

  res.json({ success: true });
});
