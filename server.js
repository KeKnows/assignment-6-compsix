const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

const db = new sqlite3.Database('./database/task_management.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to task_management.db');
    }
});


function authMiddleware(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}



app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({ message: 'User registered successfully' });
            }
        );
    });
});



app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;

        res.json({ message: 'Login successful' });
    });
});



app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out successfully' });
    });
});



app.get('/api/projects', authMiddleware, (req, res) => {
    db.all(
        'SELECT * FROM projects WHERE userId = ?',
        [req.session.userId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});



app.post('/api/projects', authMiddleware, (req, res) => {
    const { name, description } = req.body;

    db.run(
        'INSERT INTO projects (name, description, userId) VALUES (?, ?, ?)',
        [name, description, req.session.userId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
