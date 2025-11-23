const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', [verifyToken, isAdmin], controller.createUser);
router.get('/', [verifyToken, isAdmin], controller.getAllUsers);
router.put('/:id', [verifyToken, isAdmin], controller.updateUser);
router.delete('/:id', [verifyToken, isAdmin], controller.deleteUser);

module.exports = router;
