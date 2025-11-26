// File: middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Format token biasanya: "Bearer TOKEN_DISINI"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Tidak ada token

    jwt.verify(token, process.env.JWT_SECRET || 'rahasia_negara', (err, user) => {
        if (err) return res.sendStatus(403); // Token tidak valid
        req.user = user; // Simpan data user ke request
        next(); // Lanjut ke fungsi berikutnya
    });
}

module.exports = authenticateToken;