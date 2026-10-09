const db = require('../database/connection');

class DashboardController {
  async getMetrics(req, res) {
    // Retorna os dados do dashboard do torneio ativo (mocked ID for now: can be from req params)
    
    try {
      // Get Torneio
      const torneioRes = await db.query('SELECT * FROM TORNEIOS LIMIT 1');
      if (torneioRes.rows.length === 0) return res.json({});
      const torneio = torneioRes.rows[0];

      // Total de atletas e vagas
      const categoriasRes = await db.query('SELECT id, nome, numero_vagas, vagas_preenchidas FROM CATEGORIAS WHERE torneio_id = $1', [torneio.id]);
      const categorias = categoriasRes.rows;
      
      const totalVagas = categorias.reduce((acc, c) => acc + c.numero_vagas, 0);
      const vagasPreenchidas = categorias.reduce((acc, c) => acc + c.vagas_preenchidas, 0);

      // Partidas
      const partidasRes = await db.query('SELECT status FROM PARTIDAS');
      const partidas = partidasRes.rows;
      const partFinalizadas = partidas.filter(p => p.status === 'finalizada').length;
      const partAndamento = partidas.filter(p => p.status === 'em_andamento').length;
      const partAquec = partidas.filter(p => p.status === 'aquecimento').length;
      const partAgendadas = partidas.filter(p => p.status === 'agendada').length;

      // Inscrições e Financeiro
      const inscricoesRes = await db.query('SELECT status, valor_pago, data_inscricao FROM INSCRICOES WHERE torneio_id = $1', [torneio.id]);
      const inscricoes = inscricoesRes.rows;
      
      const totalPendentes = inscricoes.filter(i => i.status === 'pendente').length;
      const totalConfirmadas = inscricoes.filter(i => i.status === 'confirmada').length;
      const totalReceita = inscricoes.reduce((acc, i) => acc + parseFloat(i.valor_pago || 0), 0);

      // Agrupando inscrições por dia (simplificado para o frontend mock chart)
      const dailyInscricoesMap = {};
      inscricoes.forEach(i => {
        const dia = i.data_inscricao.toISOString().split('T')[0];
        if (!dailyInscricoesMap[dia]) dailyInscricoesMap[dia] = { dia, confirmadas: 0, pendentes: 0 };
        if (i.status === 'confirmada') dailyInscricoesMap[dia].confirmadas++;
        else dailyInscricoesMap[dia].pendentes++;
      });
      const dailyInscricoes = Object.values(dailyInscricoesMap).sort((a, b) => a.dia.localeCompare(b.dia));

      // Mock de PIX recente e Distribuição por nível para fins visuais (pode ser real depois)
      const nivelDistribuicao = [
        { name: 'Profissional', value: 32, color: '#003366' },
        { name: 'Nível A', value: 40, color: '#006699' },
        { name: 'Nível B', value: 46, color: '#FF6600' },
        { name: 'Nível C', value: 24, color: '#FFD700' },
      ];

      const recentePix = [
        { id: 'PX-9382', atleta: 'André Santos', valor: 250, horario: '14:23', status: 'confirmado' },
        { id: 'PX-9383', atleta: 'Gabriel Medina', valor: 400, horario: '14:45', status: 'pendente' }
      ];

      res.json({
        torneio,
        totalVagas,
        vagasPreenchidas,
        partidas: {
          total: partidas.length,
          finalizadas: partFinalizadas,
          em_andamento: partAndamento,
          aquecimento: partAquec,
          agendadas: partAgendadas
        },
        inscricoes: {
          pendentes: totalPendentes,
          confirmadas: totalConfirmadas,
          receitaTotal: totalReceita
        },
        categorias,
        dailyInscricoes: dailyInscricoes.length > 0 ? dailyInscricoes : [{ dia: 'Hoje', confirmadas: totalConfirmadas, pendentes: totalPendentes }],
        nivelDistribuicao,
        recentePix
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao gerar dashboard' });
    }
  }
}

module.exports = new DashboardController();
