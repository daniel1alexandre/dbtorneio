const db = require('../database/connection');

class PixController {
  // Webhook que os provedores de pagamento (ex: MercadoPago, Asaas, Stripe) chamam ao confirmar PIX
  async webhookCallback(req, res) {
    // Na vida real: Validar assinatura/secret do webhook para garantir segurança
    const { pix_id, status_pagamento } = req.body; 

    if (!pix_id || status_pagamento !== 'CONFIRMADO') {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    try {
      await db.query('BEGIN');

      // 1. Achar o pagamento pendente
      const pgQuery = await db.query(
        'SELECT inscricao_id, valor, status FROM PAGAMENTOS WHERE webhook_id = $1 FOR UPDATE',
        [pix_id]
      );

      if (pgQuery.rows.length === 0) {
        throw new Error('Pagamento não localizado');
      }

      const pagamento = pgQuery.rows[0];
      if (pagamento.status === 'confirmado') {
        await db.query('ROLLBACK');
        return res.json({ message: 'Pagamento já processado anteriormente' });
      }

      // 2. Atualiza PAGAMENTOS
      await db.query(
        'UPDATE PAGAMENTOS SET status = $1, confirmado_em = NOW() WHERE webhook_id = $2',
        ['confirmado', pix_id]
      );

      // 3. Atualiza INSCRICOES
      const inscQuery = await db.query(
        `UPDATE INSCRICOES 
         SET status = 'confirmada', valor_pago = $1, data_pagamento = NOW() 
         WHERE id = $2 RETURNING categoria_id`,
        [pagamento.valor, pagamento.inscricao_id]
      );

      // 4. Incrementa vagas_preenchidas na categoria
      const catId = inscQuery.rows[0].categoria_id;
      await db.query('UPDATE CATEGORIAS SET vagas_preenchidas = vagas_preenchidas + 1 WHERE id = $1', [catId]);

      // TODO: Emitir evento no WebSocket para notificar o frontend sobre a conciliação em tempo real.
      // global.wss.clients.forEach(c => c.send(JSON.stringify({ type: 'PIX_CONFIRMADO', pix_id })));

      await db.query('COMMIT');
      res.json({ message: 'Webhook processado com sucesso e inscrição confirmada' });
      
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Erro no processamento do webhook PIX:', error);
      res.status(500).json({ error: 'Erro interno ao processar webhook' });
    }
  }
}

module.exports = new PixController();
