// ─── Mock Data: TourneyBeach Platform ───────────────────────────────────────

export const torneioAtivo = {
  id: '9b12e3f5-79a4-4a27-a0f5-5643448f8776',
  nome: 'Copa Elite Copacabana 2026 - Master Series',
  local: 'Praia de Copacabana, Posto 4 - Rio de Janeiro',
  data_inicio: '2026-12-01',
  data_fim: '2026-12-04',
  numero_quadras: 8,
  horario_inicio: '08:00',
  horario_fim: '22:00',
  status: 'em_andamento',
};

export const torneios = [
  {
    id: '9b12e3f5-79a4-4a27-a0f5-5643448f8776',
    nome: 'Copa Elite Copacabana 2026 - Master Series',
    data_inicio: '2026-12-01',
    data_fim: '2026-12-04',
    local: 'Praia de Copacabana, Posto 4',
    numero_quadras: 8,
    status: 'em_andamento',
    receita_total: 48500,
    despesa_total: 19200,
    inscricoes_total: 164,
  },
  {
    id: '7b0849ce-ec38-4f51-bce0-68153c399a9a',
    nome: 'Circuito Open de Verão 2026',
    data_inicio: '2026-11-15',
    data_fim: '2026-11-18',
    local: 'Arena Central Beach, Rio de Janeiro',
    numero_quadras: 12,
    status: 'inscricoes_abertas',
    receita_total: 32000,
    despesa_total: 14500,
    inscricoes_total: 98,
  },
  {
    id: 'a1b2c3d4-0000-4000-8000-000000000001',
    nome: 'Liga Carioca Pro de Beach Tennis',
    data_inicio: '2026-10-20',
    data_fim: '2026-10-22',
    local: 'Barra da Tijuca, Rio de Janeiro',
    numero_quadras: 6,
    status: 'finalizado',
    receita_total: 22400,
    despesa_total: 9800,
    inscricoes_total: 72,
  },
];

export const categorias = [
  { id: 'c1f72537-eb4a-46da-b7ee-d1cf8cba6783', nome: 'Duplas Masculino Pro', nivel: 'profissional', vagas: 32, confirmados: 32, valor: 400 },
  { id: 'c2f72537-eb4a-46da-b7ee-d1cf8cba6784', nome: 'Duplas Feminino A', nivel: 'A', vagas: 24, confirmados: 20, valor: 300 },
  { id: 'c3f72537-eb4a-46da-b7ee-d1cf8cba6785', nome: 'Duplas Mistas B', nivel: 'B', vagas: 32, confirmados: 28, valor: 250 },
  { id: 'c4f72537-eb4a-46da-b7ee-d1cf8cba6786', nome: 'Duplas Masculino C', nivel: 'C', vagas: 32, confirmados: 24, valor: 200 },
  { id: 'c5f72537-eb4a-46da-b7ee-d1cf8cba6787', nome: 'Sub-18 Masculino', nivel: 'B', vagas: 16, confirmados: 14, valor: 150 },
  { id: 'c6f72537-eb4a-46da-b7ee-d1cf8cba6788', nome: '+40 Misto', nivel: 'B', vagas: 24, confirmados: 18, valor: 200 },
];

export const inscricoes = [
  { id: '3c7b399d-001', atleta: 'Gabriel Medina Santos', parceiro: 'Felipe Toledo Arruda', categoria: 'Duplas Masculino Pro', status: 'confirmada', valor_pago: 400, data_inscricao: '2026-10-05T09:14:00Z', data_pagamento: '2026-10-05T09:22:00Z', pix_id: 'PIX-001122334455' },
  { id: '3c7b399d-002', atleta: 'Ana Paula Rodrigues', parceiro: 'Carla Souza Lima', categoria: 'Duplas Feminino A', status: 'confirmada', valor_pago: 300, data_inscricao: '2026-10-05T10:30:00Z', data_pagamento: '2026-10-05T10:45:00Z', pix_id: 'PIX-002233445566' },
  { id: '3c7b399d-003', atleta: 'Ricardo Oliveira', parceiro: 'Juliana Martins', categoria: 'Duplas Mistas B', status: 'confirmada', valor_pago: 250, data_inscricao: '2026-10-06T08:00:00Z', data_pagamento: '2026-10-06T08:12:00Z', pix_id: 'PIX-003344556677' },
  { id: '3c7b399d-004', atleta: 'Lucas Pereira Costa', parceiro: 'Thiago Alves Nunes', categoria: 'Duplas Masculino C', status: 'pendente', valor_pago: 0, data_inscricao: '2026-10-07T14:20:00Z', data_pagamento: null, pix_id: null },
  { id: '3c7b399d-005', atleta: 'Fernanda Costa Silva', parceiro: 'Mariana Torres', categoria: 'Duplas Feminino A', status: 'confirmada', valor_pago: 300, data_inscricao: '2026-10-07T15:00:00Z', data_pagamento: '2026-10-07T15:18:00Z', pix_id: 'PIX-004455667788' },
  { id: '3c7b399d-006', atleta: 'Bruno Magalhães', parceiro: 'André Santos', categoria: 'Duplas Masculino Pro', status: 'confirmada', valor_pago: 400, data_inscricao: '2026-10-07T16:30:00Z', data_pagamento: '2026-10-07T16:44:00Z', pix_id: 'PIX-005566778899' },
  { id: '3c7b399d-007', atleta: 'Pedro Henrique Lima', parceiro: 'Victor Ramos', categoria: 'Duplas Mistas B', status: 'cancelada', valor_pago: 0, data_inscricao: '2026-10-08T09:00:00Z', data_pagamento: null, pix_id: null },
  { id: '3c7b399d-008', atleta: 'Camila Ferreira', parceiro: 'Patricia Gomes', categoria: '+40 Misto', status: 'confirmada', valor_pago: 200, data_inscricao: '2026-10-08T11:00:00Z', data_pagamento: '2026-10-08T11:20:00Z', pix_id: 'PIX-006677889900' },
  { id: '3c7b399d-009', atleta: 'Rodrigo Borges', parceiro: 'Eduardo Lins', categoria: 'Duplas Masculino Pro', status: 'confirmada', valor_pago: 400, data_inscricao: '2026-10-08T12:15:00Z', data_pagamento: '2026-10-08T12:30:00Z', pix_id: 'PIX-007788990011' },
  { id: '3c7b399d-010', atleta: 'Renata Alves', parceiro: 'Sofia Duarte', categoria: 'Sub-18 Masculino', status: 'pendente', valor_pago: 0, data_inscricao: '2026-10-08T14:00:00Z', data_pagamento: null, pix_id: null },
];

export const partidas = [
  { id: 'p001', quadra: 1, horario: '08:00', data: '2026-12-01', dupla1: 'Medina / Toledo', dupla2: 'Magalhães / Santos', categoria: 'Pro', fase: 'Quartas', status: 'finalizada', placar: '6x4 / 6x3', vencedor: 'Medina / Toledo' },
  { id: 'p002', quadra: 1, horario: '10:30', data: '2026-12-01', dupla1: 'Borges / Lins', dupla2: 'Costa / Nunes', categoria: 'Pro', fase: 'Quartas', status: 'em_andamento', placar: '6x3', vencedor: null },
  { id: 'p003', quadra: 2, horario: '08:00', data: '2026-12-01', dupla1: 'Rodrigues / Lima', dupla2: 'Costa / Torres', categoria: 'Fem A', fase: 'Semi', status: 'aquecimento', placar: null, vencedor: null },
  { id: 'p004', quadra: 2, horario: '10:00', data: '2026-12-01', dupla1: 'Ferreira / Gomes', dupla2: 'Oliveira / Martins', categoria: 'Mista B', fase: 'Quartas', status: 'agendada', placar: null, vencedor: null },
  { id: 'p005', quadra: 3, horario: '09:00', data: '2026-12-01', dupla1: 'Pereira / Alves', dupla2: 'Silva / Silveira', categoria: 'C Masc', fase: 'Oitavas', status: 'agendada', placar: null, vencedor: null },
  { id: 'p006', quadra: 3, horario: '11:00', data: '2026-12-01', dupla1: 'Ramos / Cruz', dupla2: 'Pinto / Faria', categoria: 'C Masc', fase: 'Oitavas', status: 'agendada', placar: null, vencedor: null },
  { id: 'p007', quadra: 4, horario: '08:30', data: '2026-12-01', dupla1: 'Duarte / Cunha', dupla2: 'Barros / Melo', categoria: '+40 Misto', fase: 'Quartas', status: 'agendada', placar: null, vencedor: null },
  { id: 'p008', quadra: 4, horario: '10:30', data: '2026-12-01', dupla1: 'Teixeira / Rocha', dupla2: 'Moreira / Xavier', categoria: 'Sub-18', fase: 'Semi', status: 'agendada', placar: null, vencedor: null },
  { id: 'p009', quadra: 5, horario: '09:30', data: '2026-12-01', dupla1: 'Lima / Freitas', dupla2: 'Araújo / Cardoso', categoria: 'Fem A', fase: 'Quartas', status: 'agendada', placar: null, vencedor: null },
  { id: 'p010', quadra: 6, horario: '08:00', data: '2026-12-01', dupla1: 'Monteiro / Vieira', dupla2: 'Correia / Lopes', categoria: 'Mista B', fase: 'Oitavas', status: 'finalizada', placar: '4x6 / 6x4 / 10x8', vencedor: 'Monteiro / Vieira' },
];

export const quadras = [
  { id: 'q1', numero: 1, localizacao: 'Setor Norte A', ativa: true, partida_atual: 'Borges / Lins vs Costa / Nunes' },
  { id: 'q2', numero: 2, localizacao: 'Setor Norte B', ativa: true, partida_atual: 'Aquecimento - Rodrigues / Lima' },
  { id: 'q3', numero: 3, localizacao: 'Setor Central A', ativa: true, partida_atual: null },
  { id: 'q4', numero: 4, localizacao: 'Setor Central B', ativa: true, partida_atual: null },
  { id: 'q5', numero: 5, localizacao: 'Setor Sul A', ativa: true, partida_atual: null },
  { id: 'q6', numero: 6, localizacao: 'Setor Sul B', ativa: true, partida_atual: null },
  { id: 'q7', numero: 7, localizacao: 'Arena VIP', ativa: false, partida_atual: null },
  { id: 'q8', numero: 8, localizacao: 'Quadra Demonstração', ativa: false, partida_atual: null },
];

export const financeiro = {
  receita_total: 48500,
  despesa_total: 19200,
  lucro: 29300,
  taxa_conversao: 87.4,
  receitas: [
    { id: 'r1', descricao: 'Inscrições Duplas Masculino Pro', categoria: 'Inscrição', valor: 12800, data: '2026-10-05', tipo: 'receita_inscricao' },
    { id: 'r2', descricao: 'Inscrições Duplas Feminino A', categoria: 'Inscrição', valor: 6000, data: '2026-10-05', tipo: 'receita_inscricao' },
    { id: 'r3', descricao: 'Inscrições Duplas Mistas B', categoria: 'Inscrição', valor: 7000, data: '2026-10-06', tipo: 'receita_inscricao' },
    { id: 'r4', descricao: 'Patrocínio Master - Banco Nacional', categoria: 'Patrocínio', valor: 15000, data: '2026-10-01', tipo: 'patrocinio' },
    { id: 'r5', descricao: 'Inscrições Demais Categorias', categoria: 'Inscrição', valor: 7700, data: '2026-10-07', tipo: 'receita_inscricao' },
  ],
  despesas: [
    { id: 'd1', descricao: 'Locação de Estruturas e Tendas', categoria: 'Infraestrutura', valor: 8000, data: '2026-10-01', tipo: 'despesa_quadra' },
    { id: 'd2', descricao: 'Diária da Equipe de Arbitragem Oficial', categoria: 'Operação de Quadra', valor: 3200, data: '2026-10-08', tipo: 'despesa_arbitragem' },
    { id: 'd3', descricao: 'Premiações e Troféus', categoria: 'Premiação', valor: 4500, data: '2026-11-30', tipo: 'despesa_premio' },
    { id: 'd4', descricao: 'Equipe de Apoio e Segurança', categoria: 'Equipe', valor: 2200, data: '2026-10-02', tipo: 'despesa_equipe' },
    { id: 'd5', descricao: 'Kit Brindes para Atletas', categoria: 'Brindes', valor: 1300, data: '2026-10-03', tipo: 'brinde' },
  ],
};

export const dailyInscricoes = [
  { dia: '05/Out', confirmadas: 34, pendentes: 8, canceladas: 2 },
  { dia: '06/Out', confirmadas: 42, pendentes: 12, canceladas: 3 },
  { dia: '07/Out', confirmadas: 28, pendentes: 6, canceladas: 1 },
  { dia: '08/Out', confirmadas: 18, pendentes: 14, canceladas: 4 },
  { dia: '09/Out', confirmadas: 22, pendentes: 9, canceladas: 1 },
  { dia: '10/Out', confirmadas: 15, pendentes: 5, canceladas: 0 },
  { dia: '11/Out', confirmadas: 5, pendentes: 11, canceladas: 2 },
];

export const dailyFinanceiro = [
  { dia: '05/Out', receita: 13600, despesa: 4200 },
  { dia: '06/Out', receita: 10500, despesa: 2800 },
  { dia: '07/Out', receita: 9200, despesa: 5600 },
  { dia: '08/Out', receita: 8400, despesa: 3100 },
  { dia: '09/Out', receita: 4300, despesa: 1800 },
  { dia: '10/Out', receita: 2500, despesa: 1700 },
];

export const recentePix = [
  { id: 'PIX-001', atleta: 'Gabriel Medina', valor: 400, horario: '18:02', status: 'confirmado' },
  { id: 'PIX-002', atleta: 'Ana Rodrigues', valor: 300, horario: '17:48', status: 'confirmado' },
  { id: 'PIX-003', atleta: 'Bruno Magalhães', valor: 400, horario: '17:30', status: 'confirmado' },
  { id: 'PIX-004', atleta: 'Camila Ferreira', valor: 200, horario: '17:15', status: 'confirmado' },
  { id: 'PIX-005', atleta: 'Rodrigo Borges', valor: 400, horario: '16:55', status: 'confirmado' },
  { id: 'PIX-006', atleta: 'Lucas Pereira', valor: 250, horario: '16:30', status: 'pendente' },
  { id: 'PIX-007', atleta: 'Sofia Duarte', valor: 150, horario: '16:10', status: 'pendente' },
];

export const nivelDistribuicao = [
  { name: 'Profissional', value: 32, color: '#003366' },
  { name: 'Nível A', value: 40, color: '#006699' },
  { name: 'Nível B', value: 46, color: '#FF6600' },
  { name: 'Nível C', value: 24, color: '#FFD700' },
  { name: 'Sub-18 / +40', value: 22, color: '#00AA00' },
];

export const horarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
