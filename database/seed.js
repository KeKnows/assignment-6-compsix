const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database/task_management.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to task_management.db');
    }
});

db.serialize(() => {

    db.run(`DELETE FROM users`);
    db.run(`DELETE FROM projects`);
    db.run(`DELETE FROM tasks`);

    const password = bcrypt.hashSync('password123', 10);

    db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        ['testuser', 'test@example.com', password],
        function (err) {
            if (err) {
                console.error(err.message);
                return;
            }

            const userId = this.lastID;

            db.run(
                `INSERT INTO projects (name, description, userId) VALUES (?, ?, ?)`,
                ['Project 1', 'First test project', userId],
                function (err) {
                    if (err) return console.error(err.message);

                    const project1Id = this.lastID;

                    db.run(
                        `INSERT INTO tasks (title, completed, projectId) VALUES (?, ?, ?)`,
                        ['Task 1', 0, project1Id]
                    );
                    db.run(
                        `INSERT INTO tasks (title, completed, projectId) VALUES (?, ?, ?)`,
                        ['Task 2', 1, project1Id]
                    );
                }
            );

            db.run(
                `INSERT INTO projects (name, description, userId) VALUES (?, ?, ?)`,
                ['Project 2', 'Second test project', userId],
                function (err) {
                    if (err) return console.error(err.message);

                    const project2Id = this.lastID;

                    db.run(
                        `INSERT INTO tasks (title, completed, projectId) VALUES (?, ?, ?)`,
                        ['Task A', 0, project2Id]
                    );
                }
            );
        }
    );

    console.log('Database seeded successfully.');
});

db.close();
