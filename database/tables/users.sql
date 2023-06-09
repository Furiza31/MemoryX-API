DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    isAdmin BOOLEAN DEFAULT 0
);