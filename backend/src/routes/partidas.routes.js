const { Router } = require('express');
const partidasController = require('../controllers/partidas.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = Router();

// Listar partidas (telão pode ver)
router.get('/', partidasController.list);

// Reagendar partida (Drag & Drop no Cronograma - Organizador)
router.patch('/:id/schedule', authenticateToken, requireRole(['admin', 'organizador']), partidasController.updateSchedule);

// Atualizar status e placar (Painel do Árbitro)
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'organizador', 'arbitro']), partidasController.updateStatus);

module.exports = router;
