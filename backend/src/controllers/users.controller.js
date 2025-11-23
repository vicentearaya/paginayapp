const db = require('../database');
const bcrypt = require('bcrypt');

exports.createUser = (req, res) => {
    const { nombre, email, password, rol, turno } = req.body;
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const query = `INSERT INTO users (nombre, email, password, rol, turno) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nombre, email, hash, rol, turno], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, message: "User created successfully" });
    });
};

exports.getAllUsers = (req, res) => {
    db.all("SELECT id, nombre, email, rol, turno FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(rows);
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol, turno } = req.body;
    // Password update logic can be separate or included if provided

    const query = `UPDATE users SET nombre = ?, email = ?, rol = ?, turno = ? WHERE id = ?`;
    db.run(query, [nombre, email, rol, turno, id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "User updated successfully" });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "User deleted successfully" });
    });
};
