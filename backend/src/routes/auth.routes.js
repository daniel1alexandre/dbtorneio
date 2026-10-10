const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.registerAtleta);
router.post('/setup-admin', authController.createInitialAdmin);

module.exports = router;
