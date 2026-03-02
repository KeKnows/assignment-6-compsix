const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to university.db');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_code TEXT NOT NULL,
        title TEXT NOT NULL,
        credits INTEGER NOT NULL,
        description TEXT,
        semester TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Courses table created successfully.');
    }
    db.close();
});
