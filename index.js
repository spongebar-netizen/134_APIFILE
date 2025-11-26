const express = require('express');
const dotenv = require('dotenv');
const db = require('./models'); // Import Database

// 1. IMPORT ROUTES DARI PERBAIKAN SEBELUMNYA
// Pastikan file routes/auth.js masih ada dan isinya benar
const authRoutes = require('./routes/auth'); 

// 2. IMPORT MIDDLEWARE (Wajib ada file middleware/auth.js)
const authenticateToken = require('./middleware/auth.js'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// 1. AUTHENTICATION (Login & Register)
// =========================================================
// Aksesnya jadi: POST http://localhost:3000/auth/register
// Aksesnya jadi: POST http://localhost:3000/auth/login
app.use('/auth', authRoutes);


// =========================================================
// 2. RELASI DATA & QUERY LANJUTAN (KOMIK)
// =========================================================

// A. CREATE KOMIK (Harus Login Dulu -> pakai authenticateToken)
app.post('/komik', authenticateToken, async (req, res) => {
    try {
        const { judul, penulis, deskripsi } = req.body;
        
        // KEAJAIBAN: Ambil ID user dari Token yang sedang login
        const userId = req.user.id; 

        const komikBaru = await db.Komik.create({ 
            judul, 
            penulis, 
            deskripsi,
            userId: userId // Disimpan otomatis sebagai Foreign Key
        });

        res.status(201).json({ success: true, data: komikBaru });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// B. GET USERS + KOMIK MEREKA (Menampilkan User dan Komik buatannya)
app.get('/users-with-komik', authenticateToken, async (req, res) => {
    try {
        const users = await db.User.findAll({
            include: [{
                model: db.Komik,
                as: 'list_komik', // Pastikan di models/user.js aliasnya 'list_komik'
                attributes: ['judul', 'penulis']
            }]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// C. GET KOMIK + PEMILIKNYA (Menampilkan Komik dan Siapa pembuatnya)
app.get('/komik-with-owner', authenticateToken, async (req, res) => {
    try {
        const komiks = await db.Komik.findAll({
            include: [{
                model: db.User,
                as: 'pemilik', // Pastikan di models/komik.js aliasnya 'pemilik'
                attributes: ['username']
            }]
        });
        res.json(komiks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// =========================================================
// D. UPDATE KOMIK (FITUR BARU YANG KAMU MINTA)
// =========================================================
app.put('/komik/:id', authenticateToken, async (req, res) => {
    try {
        // 1. Ambil ID dari URL (misal: localhost:3000/komik/1)
        const { id } = req.params;
        
        // 2. Ambil Data Baru dari Body Postman
        const { judul, penulis, deskripsi } = req.body;

        // 3. Cari dulu komiknya ada gak?
        const komik = await db.Komik.findByPk(id);

        if (!komik) {
            return res.status(404).json({ message: "Komik tidak ditemukan!" });
        }

        // 4. (Opsional) Cek apakah user yang login adalah pemilik komik?
        // Kalau mau sembarang user login bisa edit, hapus if ini.
        if (komik.userId !== req.user.id) {
            return res.status(403).json({ message: "Kamu bukan pemilik komik ini, dilarang edit!" });
        }

        // 5. Lakukan Update
        await komik.update({
            judul: judul || komik.judul,       // Kalau kosong, pakai data lama
            penulis: penulis || komik.penulis, 
            deskripsi: deskripsi || komik.deskripsi
        });

        res.json({
            success: true,
            message: "Komik berhasil diupdate!",
            data: komik
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// =========================================================
// START SERVER
// =========================================================
db.sequelize.sync({ force: false })
    .then(() => {
        console.log("✅ Database PostgreSQL Terkoneksi!");
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Gagal koneksi ke database:", err.message);
    });