const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'paginavales.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL CHECK(rol IN ('admin', 'funcionario')),
            turno INTEGER CHECK(turno IN (1, 2, 3))
        )`);

        // Vouchers table
        db.run(`CREATE TABLE IF NOT EXISTS vales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            tipo_vale TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            lugar TEXT NOT NULL,
            horario_inicio TEXT NOT NULL,
            horario_fin TEXT NOT NULL,
            usado BOOLEAN DEFAULT 0,
            fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(usuario_id) REFERENCES users(id)
        )`);

        // Extra Vouchers table (can be merged into vales with a flag, but keeping separate as requested or for clarity)
        // Actually, the request says "vales_extra" table.
        db.run(`CREATE TABLE IF NOT EXISTS vales_extra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            tipo TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            usado BOOLEAN DEFAULT 0,
            fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(usuario_id) REFERENCES users(id)
        )`);

        // Audit table
        db.run(`CREATE TABLE IF NOT EXISTS auditoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_vale INTEGER,
            usuario_id INTEGER,
            fecha_canje DATETIME DEFAULT CURRENT_TIMESTAMP,
            turno INTEGER,
            detalle TEXT
        )`);

        // Create default admin if not exists
        const checkAdmin = "SELECT * FROM users WHERE email = ?";
        db.get(checkAdmin, ["admin@librosimpresos.cl"], (err, row) => {
            if (!row) {
                const password = "admin";
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    const insertAdmin = `INSERT INTO users (nombre, email, password, rol, turno) VALUES (?, ?, ?, ?, ?)`;
                    db.run(insertAdmin, ["Administrador", "admin@librosimpresos.cl", hash, "admin", 1], (err) => {
                        if (err) console.error(err.message);
                        else console.log("Default admin created.");
                    });
                });
            }
        });
    });
}

module.exports = db;
