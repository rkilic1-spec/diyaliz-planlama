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
