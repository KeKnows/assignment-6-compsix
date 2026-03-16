const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/university.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT,
      title TEXT,
      credits INTEGER,
      description TEXT,
      semester TEXT
    )
  `);

  console.log("Database and courses table created successfully.");
});

db.close();
