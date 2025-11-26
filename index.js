const express = require('express');
const app = express();
const port = 3000;

// Import semua model dan koneksi Sequelize
const db = require('./models'); // <-- Ini akan membaca models/index.js

// Middleware untuk parsing body JSON
app.use(express.json());

// ===============================================
// ===           JALANKAN SERVER               ===
// ===============================================
app.listen(port, async () => {
    console.log('Server is running on http://localhost:${port}');
    try {
        // Kita HANYA tes koneksi, TIDAK pakai sync()
        // karena tabel sudah kita buat manual
        await db.sequelize.authenticate();
        console.log('Successfully connected to the MySQL database.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

// ===============================================
// ===     RUTE-RUTE UNTUK OPERASI CRUD        ===
// ===============================================

// CREATE: Menambahkan data komik baru
app.post('/komik', async (req, res) => {
    try {
        const { judul, penulis, deskripsi } = req.body;

        if (!judul) {
            return res.status(400).json({
                success: false,
                message: 'Judul wajib diisi!'
            });
        }

        // Buat data baru
        const komikBaru = await db.Komik.create({ 
            judul: judul, 
            penulis: penulis, 
            deskripsi: deskripsi 
        });

        res.status(201).json({
            success: true,
            message: 'Komik berhasil ditambahkan',
            data: komikBaru
        });

    } catch (error) {
        console.error('Error adding komik:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// READ: Mengambil semua data komik
app.get('/komik', async (req, res) => {
    try {
        const semuaKomik = await db.Komik.findAll();

        res.status(200).json({
            success: true,
            message: 'Data komik berhasil diambil',
            data: semuaKomik
        });

    } catch (error) {
        console.error('Error fetching komik:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// READ: Mengambil satu data komik berdasarkan ID
app.get('/komik/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const komik = await db.Komik.findByPk(id);

        if (!komik) {
            return res.status(404).json({
                success: false,
                message: 'Komik tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data komik berhasil diambil',
            data: komik
        });

    } catch (error)
        {
        console.error('Error fetching komik by id:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// UPDATE: Mengubah data komik berdasarkan ID
app.put('/komik/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { judul, penulis, deskripsi } = req.body;

        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({
                success: false,
                message: 'Komik tidak ditemukan'
            });
        }

        // Lakukan update
        await komik.update({
            judul: judul,
            penulis: penulis,
            deskripsi: deskripsi
        });

        res.status(200).json({
            success: true,
            message: 'Komik berhasil diupdate',
            data: komik // Kirim data yang sudah diupdate
        });

    } catch (error) {
        console.error('Error updating komik:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// DELETE: Menghapus data komik berdasarkan ID
app.delete('/komik/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({
                success: false,
                message: 'Komik tidak ditemukan'
            });
        }

        // Hapus data
        await komik.destroy();

        res.status(200).json({
            success: true,
            message: 'Komik berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleting komik:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});