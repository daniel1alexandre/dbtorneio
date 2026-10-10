const db = require('../database/connection');

class TorneiosController {
  async list(req, res) {
    const result = await db.query('SELECT * FROM TORNEIOS ORDER BY criado_em DESC');
    res.json(result.rows);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM TORNEIOS WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Torneio não encontrado' });
    res.json(result.rows[0]);
  }

  async getDetalhes(req, res) {
    const { id } = req.params;
    try {
      const torneioRes = await db.query('SELECT * FROM TORNEIOS WHERE id = $1', [id]);
      if (torneioRes.rows.length === 0) return res.status(404).json({ error: 'Torneio não encontrado' });

      // Buscar categorias
      const catsRes = await db.query('SELECT * FROM CATEGORIAS WHERE torneio_id = $1 ORDER BY criado_em ASC', [id]);
      
      // Buscar inscrições confirmadas e pendentes (com os nomes dos atletas)
      const inscRes = await db.query(`
        SELECT i.id, i.categoria_id, i.status, 
               a1.nome_completo as atleta1, a2.nome_completo as atleta2
        FROM INSCRICOES i
        JOIN ATLETAS a1 ON i.atleta_id = a1.id
        LEFT JOIN ATLETAS a2 ON i.parceiro_id = a2.id
        WHERE i.torneio_id = $1
      `, [id]);

      const categoriasComInscricoes = catsRes.rows.map(c => ({
        ...c,
        inscricoes: inscRes.rows.filter(i => i.categoria_id === c.id)
      }));

      res.json({
        torneio: torneioRes.rows[0],
        categorias: categoriasComInscricoes
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar detalhes' });
    }
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
