const { Router } = require('express');
const pixController = require('../controllers/pix.controller');

const router = Router();

// Webhook é público e deve validar o header/assinatura do Gateway
router.post('/webhook', pixController.webhookCallback);

module.exports = router;
