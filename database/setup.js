// Import sqlite3 package
const sqlite3 = require('sqlite3').verbose();

// Connect to university.db
const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        return console.error('Error connecting to database:', err.message);
    }
    console.log('Connected to university.db database.');
});

// Insert courses into the courses table
const insertQuery = `
    INSERT INTO courses (course_code, course_name, credits, description, semester)
    VALUES (?, ?, ?, ?, ?)
`;

const courses = [
    ['CS101', 'Intro Programming', 3, 'Learn Python basics', 'Fall 2024'],
    ['BIO120', 'General Biology', 3, 'Introduction to biological principles', 'Fall 2024'],
    ['MATH150', 'Calculus I', 4, 'Basic calculus', 'Fall 2024'],
    ['ENG101', 'Composition I', 3, 'Academic writing and critical thinking', 'Spring 2025'],
    ['ME210', 'Thermodynamics', 3, 'Principles of thermodynamics and heat transfer', 'Spring 2025'],
    ['CS301', 'Database Systems', 3, 'Design and implementation of database systems', 'Fall 2024'],
    ['PHYS201', 'Physics II', 4, 'Electricity, magnetism, and modern physics', 'Spring 2025'],
    ['CS201', 'Data Structures', 4, 'Study of fundamental data structures and algorithms', 'Spring 2025']
];

// Serialize ensures statements run sequentially
db.serialize(() => {
    courses.forEach(course => {
        db.run(insertQuery, course, (err) => {
            if (err) {
                console.error('Error inserting course:', err.message);
            }
        });
    });

    console.log('Courses successfully added to the database.');

    // Close database connection
    db.close((err) => {
        if (err) {
            return console.error('Error closing database:', err.message);
        }
        console.log('Database connection closed.');
    });
});
