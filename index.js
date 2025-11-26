const express = require('express');
const app = express();
const port = 3000;

// Import
const db = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth'); // Pastikan file ini ada dari copy-an sebelumnya

app.use(express.json());

// =========================================================
// 1. AUTHENTICATION (Sama kayak Praktikum 5 - Biar bisa Login)
// =========================================================

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created', data: newUser });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.User.findOne({ where: { username } });
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Username atau Password salah' });
        }
        
        // Token nyimpen ID user
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login success', token });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// =========================================================
// 2. RELASI DATA & QUERY LANJUTAN (INTI PRAKTIKUM 7)
// =========================================================

// A. CREATE KOMIK (Otomatis deteksi User Pemilik)
app.post('/komik', authenticateToken, async (req, res) => {
    try {
        const { judul, penulis, deskripsi } = req.body;
        
        // KEAJAIBAN 1: Kita ambil ID user dari Token (req.user.id)
        // Jadi gak perlu input userId manual di body
        const userId = req.user.id; 

        const komikBaru = await db.Komik.create({ 
            judul, 
            penulis, 
            deskripsi,
            userId: userId // <-- Disimpan otomatis sebagai Foreign Key
        });

        res.status(201).json({ success: true, data: komikBaru });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// B. QUERY LANJUTAN 1: Get All Users + Komik Mereka
// (Menampilkan Bos beserta Anak Buahnya)
app.get('/users-with-komik', authenticateToken, async (req, res) => {
    try {
        const users = await db.User.findAll({
            // KEAJAIBAN 2: 'include' itu kayak JOIN di SQL
            include: [{
                model: db.Komik,
                as: 'list_komik', // Harus sama kayak di models/user.js
                attributes: ['judul', 'penulis'] // Kita cuma ambil kolom judul & penulis biar rapi
            }]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// C. QUERY LANJUTAN 2: Get All Komik + Pemiliknya
// (Menampilkan Anak Buah beserta Bosnya)
app.get('/komik-with-owner', authenticateToken, async (req, res) => {
    try {
        const komiks = await db.Komik.findAll({
            include: [{
                model: db.User,
                as: 'pemilik', // Harus sama kayak di models/komik.js
                attributes: ['username'] // Kita cuma mau tau nama username pemiliknya
            }]
        });
        res.json(komiks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Jalankan Server
app.listen(port, async () => {
    console.log(`Server jalan di http://localhost:${port}`);
    try { 
        await db.sequelize.authenticate(); 
        console.log('Database Konek! Relasi Siap!'); 
    } catch (err) { 
        console.error(err); 
    }
});