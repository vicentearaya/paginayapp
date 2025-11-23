const express = require('express');
const router = express.Router();
const controller = require('../controllers/vouchers.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', [verifyToken], controller.generateVoucher);
router.get('/', [verifyToken], controller.getVouchers);
router.get('/audit', [verifyToken, isAdmin], controller.getAudit);
router.post('/extra', [verifyToken, isAdmin], controller.generateExtra);
router.post('/redeem', [verifyToken, isAdmin], controller.redeemVoucher);

module.exports = router;
