require('dotenv').config(); // Load file .env

// Ambil variabel dari .env
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres", // <--- PENTING: Ganti 'mysql' jadi 'postgres'
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME + "_test",
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME + "_prod",
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
  },
};