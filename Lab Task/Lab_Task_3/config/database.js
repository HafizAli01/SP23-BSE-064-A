const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    try {
      const dbPath = path.join(__dirname, '..', 'database.sqlite');
      db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('SQLite connection error:', err);
          reject(err);
        } else {
          console.log('SQLite database connected successfully');
          
          // Create tables if they don't exist
          db.serialize(() => {
            // Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
              id TEXT PRIMARY KEY,
              username TEXT UNIQUE NOT NULL,
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            // Products table
            db.run(`CREATE TABLE IF NOT EXISTS products (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              price REAL NOT NULL,
              category TEXT,
              image TEXT,
              stock INTEGER DEFAULT 0,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            // Orders table
            db.run(`CREATE TABLE IF NOT EXISTS orders (
              id TEXT PRIMARY KEY,
              userId TEXT NOT NULL,
              items TEXT NOT NULL,
              total REAL NOT NULL,
              status TEXT DEFAULT 'pending',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (userId) REFERENCES users (id)
            )`);
          });
          
          resolve(db);
        }
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      reject(error);
    }
  });
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = { connectDB, getDB };