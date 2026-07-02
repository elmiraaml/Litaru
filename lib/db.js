const mysql = require("mysql2/promise");

// SERVER ONLY — jangan pernah import file ini dari komponen "use client".
// Next.js otomatis baca .env.local, gak perlu require("dotenv").config() lagi.

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;