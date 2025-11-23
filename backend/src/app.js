const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const voucherRoutes = require('./routes/vouchers.routes');
const userRoutes = require('./routes/users.routes');
// const auditRoutes = require('./routes/audit.routes');

app.use('/api/auth', authRoutes);
app.use('/api/vales', voucherRoutes);
app.use('/api/usuarios', userRoutes);
// app.use('/api/auditoria', auditRoutes);

app.get('/', (req, res) => {
    res.send('Libros Impresos Voucher API Running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
