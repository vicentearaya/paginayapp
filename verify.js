const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let adminToken = '';
let userToken = '';

async function runVerification() {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@librosimpresos.cl',
            password: 'admin'
        });
        adminToken = loginRes.data.accessToken;
        console.log('Admin logged in. Token obtained.');

        console.log('2. Creating a new User (Funcionario, Shift 1)...');
        const uniqueEmail = `user${Date.now()}@test.com`;
        await axios.post(`${API_URL}/usuarios`, {
            nombre: 'Test User',
            email: uniqueEmail,
            password: 'password123',
            rol: 'funcionario',
            turno: 1
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('User created.');

        console.log('3. Logging in as new User...');
        const userLoginRes = await axios.post(`${API_URL}/auth/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        userToken = userLoginRes.data.accessToken;
        console.log('User logged in.');

        console.log('4. Generating Voucher (Desayuno - Allowed for Shift 1)...');
        const voucherRes = await axios.post(`${API_URL}/vales`, {
            type: 'Desayuno'
        }, { headers: { Authorization: `Bearer ${userToken}` } });
        console.log('Voucher generated:', voucherRes.data.voucher.code);

        console.log('5. Verifying Audit Log (Admin)...');
        const auditRes = await axios.get(`${API_URL}/vales/audit`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const found = auditRes.data.find(v => v.codigo === voucherRes.data.voucher.code);
        if (found) console.log('Voucher found in audit log.');
        else console.error('Voucher NOT found in audit log.');

        console.log('VERIFICATION SUCCESSFUL');
    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
}

// Install axios first: npm install axios
runVerification();
