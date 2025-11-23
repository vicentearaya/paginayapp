const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey';

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(404).json({ message: "User not found" });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, role: user.rol, shift: user.turno }, SECRET_KEY, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            id: user.id,
            username: user.nombre,
            email: user.email,
            role: user.rol,
            shift: user.turno,
            accessToken: token
        });
    });
};

exports.logout = (req, res) => {
    // Client side handles token removal
    res.status(200).json({ message: "Logged out successfully" });
};
