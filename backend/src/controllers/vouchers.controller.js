const db = require('../database');
const crypto = require('crypto');

const SHIFT_RULES = {
    1: {
        allowed: ['Desayuno', 'Almuerzo'],
        times: {
            'Desayuno': { start: '10:00', end: '11:00', location: 'Cafetería' },
            'Almuerzo': { start: '13:00', end: '14:00', location: 'Casino' }
        }
    },
    2: {
        allowed: ['Merienda', 'Cena 1'],
        times: {
            'Merienda': { start: '18:00', end: '19:00', location: 'Cafetería' },
            'Cena 1': { start: '21:00', end: '22:00', location: 'Casino' }
        }
    },
    3: {
        allowed: ['Cena 2', 'Desayuno'],
        times: {
            'Cena 2': { start: '01:00', end: '02:00', location: 'Casino' },
            'Desayuno': { start: '06:00', end: '07:00', location: 'Cafetería' }
        }
    }
};

exports.generateVoucher = (req, res) => {
    const { type } = req.body;
    const userId = req.userId;
    const userShift = req.userShift;
    const userRole = req.userRole;

    if (userRole !== 'admin') {
        const rules = SHIFT_RULES[userShift];
        if (!rules || !rules.allowed.includes(type)) {
            return res.status(400).json({ message: `Voucher type '${type}' not allowed for Shift ${userShift}` });
        }

        const details = rules.times[type];
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();

        const today = new Date().toISOString().split('T')[0];

        db.get(`SELECT * FROM vales WHERE usuario_id = ? AND tipo_vale = ? AND date(fecha_generacion) = ?`,
            [userId, type, today], (err, row) => {
                if (err) return res.status(500).json({ message: err.message });
                if (row) return res.status(400).json({ message: "Voucher already generated for today" });

                const query = `INSERT INTO vales (codigo, tipo_vale, usuario_id, lugar, horario_inicio, horario_fin, usado) VALUES (?, ?, ?, ?, ?, ?, 1)`;
                db.run(query, [code, type, userId, details.location, details.start, details.end], function (err) {
                    if (err) return res.status(500).json({ message: err.message });
                    res.status(201).json({
                        message: "Voucher generated and redeemed",
                        voucher: { code, type, location: details.location, start: details.start, end: details.end, status: 'Redeemed' }
                    });
                });
            });
    } else {
        const isExtra = ['Galletas', 'Bebidas'].includes(type);
        const code = 'ADM-' + crypto.randomBytes(3).toString('hex').toUpperCase();

        if (isExtra) {
            db.run(`INSERT INTO vales_extra (codigo, tipo, usuario_id) VALUES (?, ?, ?)`,
                [code, type, userId], function (err) {
                    if (err) return res.status(500).json({ message: err.message });
                    res.status(201).json({ message: "Extra voucher generated", code });
                });
        } else {
            return res.status(400).json({ message: "Admin should use specific endpoint for extras or standard flow if acting as user" });
        }
    }
};

exports.getVouchers = (req, res) => {
    const userId = req.userId;
    db.all("SELECT * FROM vales WHERE usuario_id = ? ORDER BY fecha_generacion DESC", [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(rows);
    });
};

exports.getAudit = (req, res) => {
    const query = `
        SELECT v.*, u.nombre, u.turno 
        FROM vales v 
        JOIN users u ON v.usuario_id = u.id 
        ORDER BY v.fecha_generacion DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(rows);
    });
};

exports.generateExtra = (req, res) => {
    const { type } = req.body;
    const userId = req.userId;
    const code = 'EXT-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    db.run(`INSERT INTO vales_extra (codigo, tipo, usuario_id) VALUES (?, ?, ?)`,
        [code, type, userId], function (err) {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ message: "Extra voucher generated", code });
        });
};

exports.redeemVoucher = (req, res) => {
    const { code } = req.body;
    db.run("UPDATE vales SET usado = 1 WHERE codigo = ?", [code], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Voucher not found" });
        res.status(200).json({ message: "Voucher redeemed" });
    });
};
