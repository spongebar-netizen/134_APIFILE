// config/config.js

// Memuat variabel lingkungan dari file .env
require('dotenv').config(); 

module.exports = {
  // Lingkungan Development (Saat kamu coding di laptop)
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'orm', // JANGAN LUPA GANTI INI
    host: process.env.DB_HOST || '127.0.0.1',
    
    // ======================================================
    // ===          PERBAIKANNYA ADA DI SINI          ===
    // ======================================================
    port: process.env.DB_PORT || 3309, // <-- Tambahkan port di sini
    // ======================================================

    dialect: 'mysql'
  },
  
  // Lingkungan Test (Saat menjalankan testing otomatis)
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || 'orm',
    host: '127.0.0.1',
    port: process.env.DB_PORT || 3309, // <-- Tambahkan juga di sini
    dialect: 'mysql'
  },
  
  // Lingkungan Production (Saat aplikasi sudah online/live)
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD, // <-- Di production, wajib dari .env
    dialect: 'mysql'
  }
};