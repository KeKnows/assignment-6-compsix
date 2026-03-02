const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to university.db');
    }
});

app.get('/api/courses', (req, res) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/courses/:id', (req, res) => {
    db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ message: 'Course not found' });
        } else {
            res.json(row);
        }
    });
});

app.post('/api/courses', (req, res) => {
    const { course_code, title, credits, description, semester } = req.body;
    db.run(
        'INSERT INTO courses (course_code, title, credits, description, semester) VALUES (?, ?, ?, ?, ?)',
        [course_code, title, credits, description, semester],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

app.put('/api/courses/:id', (req, res) => {
    const { course_code, title, credits, description, semester } = req.body;
    db.run(
        'UPDATE courses SET course_code = ?, title = ?, credits = ?, description = ?, semester = ? WHERE id = ?',
        [course_code, title, credits, description, semester, req.params.id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ message: 'Course not found' });
            } else {
                res.json({ message: 'Course updated successfully' });
            }
        }
    );
});

app.delete('/api/courses/:id', (req, res) => {
    db.run('DELETE FROM courses WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Course not found' });
        } else {
            res.json({ message: 'Course deleted successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
