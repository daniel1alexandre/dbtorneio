const db = require('../database/connection');

class InscricoesController {
  // Cria uma nova inscrição
  async create(req, res) {
    const { torneio_id, categoria_id, atleta_id, parceiro_id } = req.body;

    try {
      // 1. Iniciar transação
      await db.query('BEGIN');

      // 2. Verificar se a categoria tem vagas
      const catQuery = await db.query('SELECT valor_inscricao, vagas_preenchidas, numero_vagas FROM CATEGORIAS WHERE id = $1', [categoria_id]);
      if (catQuery.rows.length === 0) {
        throw new Error('Categoria não encontrada');
      }

      const categoria = catQuery.rows[0];
      if (categoria.vagas_preenchidas >= categoria.numero_vagas) {
        throw new Error('Categoria sem vagas disponíveis');
      }

      // 3. Criar a inscrição
      const inscricaoQuery = await db.query(
        `INSERT INTO INSCRICOES (torneio_id, categoria_id, atleta_id, parceiro_id, valor_pago)
         VALUES ($1, $2, $3, $4, 0.00) RETURNING id`,
        [torneio_id, categoria_id, atleta_id, parceiro_id]
      );
      const inscricao_id = inscricaoQuery.rows[0].id;

      // 4. Gerar mock de PIX Copia e Cola
      const pix_id = `PIX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const pix_copia_cola = `00020101021126580014BR.GOV.BCB.PIX0136${pix_id}5204000053039865405${categoria.valor_inscricao}5802BR5912TourneyBeach6009SAO PAULO62070503***6304ABCD`;

      // 5. Criar registro de Pagamento Pendente
      await db.query(
        `INSERT INTO PAGAMENTOS (inscricao_id, valor, metodo, qr_code, pix_copia_cola, webhook_id)
         VALUES ($1, $2, 'pix', $3, $4, $5)`,
        [inscricao_id, categoria.valor_inscricao, 'mock_qr_code_url_here', pix_copia_cola, pix_id]
      );

      // 6. Atualizar UUID temporário do pix na inscrição (opcional, só para manter tracking direto)
      await db.query(`UPDATE INSCRICOES SET pix_id = $1 WHERE id = $2`, [pix_id, inscricao_id]);

      // 7. Commit
      await db.query('COMMIT');

      res.status(201).json({
        message: 'Inscrição criada. Aguardando pagamento.',
        inscricao_id,
        pagamento: {
          valor: categoria.valor_inscricao,
          pix_copia_cola,
          pix_id
        }
      });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error(error);
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'O atleta já está inscrito nesta categoria.' });
      }
      res.status(400).json({ error: error.message || 'Erro ao processar inscrição' });
    }
  }

  // Listar inscrições (com filtros)
  async list(req, res) {
    const { torneio_id, status } = req.query;
    
    let query = `
      SELECT i.id, i.status, i.valor_pago, i.data_inscricao,
             a1.nome_completo as atleta_nome, 
             a2.nome_completo as parceiro_nome,
             c.nome as categoria_nome
      FROM INSCRICOES i
      JOIN ATLETAS a1 ON i.atleta_id = a1.id
      LEFT JOIN ATLETAS a2 ON i.parceiro_id = a2.id
      JOIN CATEGORIAS c ON i.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (torneio_id) {
      params.push(torneio_id);
      query += ` AND i.torneio_id = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      query += ` AND i.status = $${params.length}`;
    }

    query += ' ORDER BY i.data_inscricao DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  }
}

module.exports = new InscricoesController();
