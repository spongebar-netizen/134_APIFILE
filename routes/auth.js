const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');   // Buat enkripsi password
const jwt = require('jsonwebtoken');  // Buat bikin Token
const db = require('../models');      // Import Database User

// =========================================================
// 1. REGISTER (Bikin User Baru dengan Password Ter-enkripsi)
// =========================================================
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Enkripsi password sebelum disimpan ke DB
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Simpan user baru
        const newUser = await db.User.create({ 
            username, 
            password: hashedPassword 
        });

        res.status(201).json({ message: "Register Berhasil", data: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================================================
// 2. LOGIN (Cek Password & Bikin Token)
// =========================================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // A. Cari User berdasarkan username
        const user = await db.User.findOne({ where: { username } });
        
        // B. Cek apakah user ada?
        if (!user) {
            return res.status(401).json({ message: "Username tidak ditemukan" });
        }

        // C. Cek apakah password cocok?
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password salah" });
        }
        
        // D. GENERATE TOKEN (Ini yang kamu minta)
        const token = jwt.sign(
            { id: user.id, username: user.username }, // Data yang disimpan di dalam token
            process.env.JWT_SECRET || 'rahasia_negara', // Kunci rahasia (ambil dari .env)
            { expiresIn: '1h' } // Token kadaluwarsa dalam 1 jam
        );

        // Kirim Token ke pengguna
        res.json({ message: "Login Berhasil", token: token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;