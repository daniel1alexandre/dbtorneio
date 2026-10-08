const db = require('../database/connection');

class TorneiosController {
  async list(req, res) {
    const result = await db.query('SELECT * FROM TORNEIOS ORDER BY criado_em DESC');
    res.json(result.rows);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM TORNEIOS WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Torneio não encontrado' });
    }
    
    res.json(result.rows[0]);
  }

  async create(req, res) {
    const { nome, descricao, data_inicio, data_fim, local, numero_quadras, horario_inicio, horario_fim } = req.body;
    
    // O criador é o usuário logado
    const criado_por = req.user.id;

    const result = await db.query(
      `INSERT INTO TORNEIOS 
      (nome, descricao, data_inicio, data_fim, local, numero_quadras, horario_inicio, horario_fim, criado_por) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nome, descricao, data_inicio, data_fim, local, numero_quadras, horario_inicio, horario_fim, criado_por]
    );

    res.status(201).json(result.rows[0]);
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body; // 'planejamento', 'inscricoes_abertas', 'inscricoes_fechadas', 'em_andamento', 'finalizado'

    const result = await db.query(
      `UPDATE TORNEIOS SET status = $1, atualizado_em = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Torneio não encontrado' });
    }

    res.json(result.rows[0]);
  }
}

module.exports = new TorneiosController();
