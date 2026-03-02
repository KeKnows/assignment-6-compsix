const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.json());


const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to university.db');
    }
});



app.get('/api/courses', (req, res) => {
    const sql = `SELECT * FROM courses`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});



app.get('/api/courses/:id', (req, res) => {
    const sql = `SELECT * FROM courses WHERE id = ?`;

    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(row);
    });
});



app.post('/api/courses', (req, res) => {
    const { course_code, title, credits, description, semester } = req.body;

    const sql = `
        INSERT INTO courses (course_code, title, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [course_code, title, credits, description, semester], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: 'Course created successfully',
            id: this.lastID
        });
    });
});



app.put('/api/courses/:id', (req, res) => {
    const { course_code, title, credits, description, semester } = req.body;

    const sql = `
        UPDATE courses
        SET course_code = ?, title = ?, credits = ?, description = ?, semester = ?
        WHERE id = ?
    `;

    db.run(sql,
        [course_code, title, credits, description, semester, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.json({ message: 'Course updated successfully' });
        }
    );
});



app.delete('/api/courses/:id', (req, res) => {
    const sql = `DELETE FROM courses WHERE id = ?`;

    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully' });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
