const { Router } = require('express');
const torneiosController = require('../controllers/torneios.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = Router();

// Rotas públicas ou abertas
router.get('/', torneiosController.list);
router.get('/:id', torneiosController.getById);

// Rotas protegidas (apenas admin ou organizador)
router.use(authenticateToken);

router.post('/', requireRole(['organizador']), torneiosController.create);
router.patch('/:id/status', requireRole(['organizador']), torneiosController.updateStatus);

module.exports = router;
