const { Router } = require('express');
const inscricoesController = require('../controllers/inscricoes.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = Router();

// Endpoint público para inscrever-se no torneio (atleta logado ou deslogado dependendo da regra, aqui deixaremos como exigido login básico)
router.post('/', authenticateToken, inscricoesController.create);

// Apenas admin/organizador pode listar as inscrições
router.get('/', authenticateToken, requireRole(['admin', 'organizador']), inscricoesController.list);

module.exports = router;
