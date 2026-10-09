const db = require('../database/connection');

// Helper para emitir via WebSockets para todos os clientes conectados (Telão, Dashboard, etc)
function broadcastWS(type, payload) {
  if (global.wss && global.wss.clients) {
    const msg = JSON.stringify({ type, payload });
    global.wss.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(msg);
      }
    });
  }
}

class PartidasController {
  
  // Listar todas as partidas com detalhes dos atletas
  async list(req, res) {
    const { torneio_id, status, data } = req.query;
    
    // Simplificando o join para fins do escopo. Na prática, você joinará com quadras e atletas.
    let query = `
      SELECT p.*, q.numero as quadra_numero,
             a1.nome_completo as atleta1_nome,
             a2.nome_completo as atleta2_nome,
             a3.nome_completo as atleta3_nome,
             a4.nome_completo as atleta4_nome
      FROM PARTIDAS p
      LEFT JOIN QUADRAS q ON p.quadra_id = q.id
      JOIN CHAVEAMENTOS ch ON p.chaveamento_id = ch.id
      LEFT JOIN ATLETAS a1 ON p.atleta1_id = a1.id
      LEFT JOIN ATLETAS a2 ON p.atleta2_id = a2.id
      LEFT JOIN ATLETAS a3 ON p.atleta3_id = a3.id
      LEFT JOIN ATLETAS a4 ON p.atleta4_id = a4.id
      WHERE ($1::uuid IS NULL OR ch.torneio_id = $1::uuid)
    `;
    const params = [torneio_id];

    if (status) {
      params.push(status);
      query += ` AND p.status = $${params.length}`;
    }
    
    if (data) {
      params.push(data);
      query += ` AND p.data_agendada = $${params.length}`;
    }

    query += ' ORDER BY p.data_agendada ASC, p.horario_agendado ASC';
    const result = await db.query(query, params);
    
    res.json(result.rows);
  }

  // Atualiza alocação na Quadra e Horário (Ação do Drag and Drop)
  async updateSchedule(req, res) {
    const { id } = req.params;
    const { quadra_id, horario_agendado, data_agendada } = req.body;

    try {
      const result = await db.query(
        `UPDATE PARTIDAS 
         SET quadra_id = $1, horario_agendado = $2, data_agendada = $3, atualizado_em = NOW() 
         WHERE id = $4 RETURNING *`,
        [quadra_id, horario_agendado, data_agendada, id]
      );

      if (result.rows.length === 0) return res.status(404).json({ error: 'Partida não encontrada' });

      // Emite via WS para o Telão e outros Arbitros
      broadcastWS('PARTIDA_REAGENDADA', { partida_id: id, quadra_id, horario_agendado, data_agendada });

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao reagendar partida' });
    }
  }

  // Painel do Árbitro: Mudar status (aquecimento, em_andamento, finalizada)
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status, placar_set1, placar_set2, placar_set3, vencedor_id } = req.body;

    try {
      await db.query('BEGIN');

      const result = await db.query(
        `UPDATE PARTIDAS 
         SET status = $1, placar_set1 = $2, placar_set2 = $3, placar_set3 = $4, vencedor_id = $5, atualizado_em = NOW()
         WHERE id = $6 RETURNING *`,
        [status, placar_set1 || null, placar_set2 || null, placar_set3 || null, vencedor_id || null, id]
      );

      if (result.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: 'Partida não encontrada' });
      }

      // Inserir no histórico de eventos da partida
      let eventoTipo;
      if (status === 'aquecimento') eventoTipo = 'aquecimento_iniciado';
      else if (status === 'em_andamento') eventoTipo = 'partida_iniciada';
      else if (status === 'finalizada') eventoTipo = 'partida_finalizada';

      if (eventoTipo) {
        await db.query(
          `INSERT INTO HISTORICO_PARTIDAS (partida_id, evento, dados_adicionais) VALUES ($1, $2, $3)`,
          [id, eventoTipo, JSON.stringify({ placar_set1, placar_set2, placar_set3 })]
        );
      }

      await db.query('COMMIT');

      // Notificar o Telão/Dashboard em tempo real!
      broadcastWS('PARTIDA_STATUS_ALTERADO', {
        partida_id: id,
        status,
        placar: { set1: placar_set1, set2: placar_set2, set3: placar_set3 },
        vencedor_id
      });

      res.json(result.rows[0]);
    } catch (err) {
      await db.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Erro ao alterar status da partida' });
    }
  }
}

module.exports = new PartidasController();
