const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', authenticateToken, dashboardController.getMetrics);

module.exports = router;
