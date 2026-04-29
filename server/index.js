const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   TASKS (IN-MEMORY)
========================= */
let tasks = [
  { id: 1, text: "Learn React", completed: false },
  { id: 2, text: "Build App", completed: false }
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  res.json(tasks);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.json(tasks);
});

/* =========================
   DATABASE CONNECTION
========================= */
const db = new sqlite3.Database("./contacts.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

/* =========================
   CREATE TABLE
========================= */
db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    reason TEXT,
    notes TEXT
  )
`);

/* =========================
   CONTACT ROUTES (DATABASE)
========================= */

// SAVE CONTACT
app.post("/contact", (req, res) => {
  const { name, email, reason, notes } = req.body;

  const sql = `
    INSERT INTO contacts (name, email, reason, notes)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, email, reason, notes], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Saved successfully", id: this.lastID });
  });
});

// GET ALL CONTACTS
app.get("/contacts", (req, res) => {
  db.all("SELECT * FROM contacts", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => console.log("Server running on port 5000"));
// DELETE CONTACT
app.delete("/contacts/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM contacts WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Deleted successfully" });
  });
});