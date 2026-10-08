CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE tipo_usuario_enum AS ENUM ('admin', 'organizador', 'arbitro', 'espectador');
CREATE TABLE USUARIOS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  tipo_usuario tipo_usuario_enum NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE status_torneio_enum AS ENUM ('planejamento', 'inscricoes_abertas', 'inscricoes_fechadas', 'em_andamento', 'finalizado');
CREATE TABLE TORNEIOS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  local VARCHAR(255) NOT NULL,
  numero_quadras INTEGER NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  status status_torneio_enum DEFAULT 'planejamento' NOT NULL,
  criado_por UUID NOT NULL REFERENCES USUARIOS(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE nivel_tecnico_enum AS ENUM ('profissional', 'A', 'B', 'C', 'D', 'iniciante');
CREATE TYPE faixa_etaria_enum AS ENUM ('open', 'sub14', 'sub18', 'plus40', 'plus50');
CREATE TYPE tipo_chave_enum AS ENUM ('simples_masc', 'simples_fem', 'duplas_masc', 'duplas_fem', 'duplas_mistas');
CREATE TABLE CATEGORIAS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneio_id UUID NOT NULL REFERENCES TORNEIOS(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  nivel_tecnico nivel_tecnico_enum NOT NULL,
  faixa_etaria faixa_etaria_enum NOT NULL,
  tipo_chave tipo_chave_enum NOT NULL,
  valor_inscricao DECIMAL(10,2) NOT NULL,
  numero_vagas INTEGER NOT NULL,
  vagas_preenchidas INTEGER DEFAULT 0 NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE genero_enum AS ENUM ('masculino', 'feminino', 'outro');
CREATE TABLE ATLETAS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES USUARIOS(id) ON DELETE RESTRICT,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  data_nascimento DATE NOT NULL,
  genero genero_enum NOT NULL,
  ranking_pontos INTEGER DEFAULT 0 NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE status_inscricao_enum AS ENUM ('pendente', 'confirmada', 'cancelada');
CREATE TABLE INSCRICOES (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneio_id UUID NOT NULL REFERENCES TORNEIOS(id) ON DELETE RESTRICT,
  categoria_id UUID NOT NULL REFERENCES CATEGORIAS(id) ON DELETE RESTRICT,
  atleta_id UUID NOT NULL REFERENCES ATLETAS(id) ON DELETE RESTRICT,
  parceiro_id UUID REFERENCES ATLETAS(id) ON DELETE SET NULL,
  status status_inscricao_enum DEFAULT 'pendente' NOT NULL,
  valor_pago DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  pix_id VARCHAR(255) UNIQUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(torneio_id, categoria_id, atleta_id)
);

CREATE TYPE metodo_pagamento_enum AS ENUM ('pix', 'cartao', 'boleto');
CREATE TYPE status_pagamento_enum AS ENUM ('pendente', 'confirmado', 'recusado');
CREATE TABLE PAGAMENTOS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscricao_id UUID NOT NULL REFERENCES INSCRICOES(id) ON DELETE RESTRICT,
  valor DECIMAL(10,2) NOT NULL,
  metodo metodo_pagamento_enum DEFAULT 'pix' NOT NULL,
  status status_pagamento_enum DEFAULT 'pendente' NOT NULL,
  qr_code TEXT NOT NULL,
  pix_copia_cola VARCHAR(255) NOT NULL,
  webhook_id VARCHAR(255),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  confirmado_em TIMESTAMP WITH TIME ZONE
);

CREATE TYPE tipo_chaveamento_enum AS ENUM ('eliminatoria_simples', 'dupla_eliminacao', 'grupos');
CREATE TYPE status_chaveamento_enum AS ENUM ('em_criacao', 'ativo', 'finalizado');
CREATE TABLE CHAVEAMENTOS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneio_id UUID NOT NULL REFERENCES TORNEIOS(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES CATEGORIAS(id) ON DELETE CASCADE,
  tipo tipo_chaveamento_enum NOT NULL,
  status status_chaveamento_enum DEFAULT 'em_criacao' NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE QUADRAS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneio_id UUID NOT NULL REFERENCES TORNEIOS(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  ativa BOOLEAN DEFAULT TRUE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE status_partida_enum AS ENUM ('agendada', 'aquecimento', 'em_andamento', 'finalizada', 'cancelada');
CREATE TABLE PARTIDAS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chaveamento_id UUID NOT NULL REFERENCES CHAVEAMENTOS(id) ON DELETE CASCADE,
  quadra_id UUID REFERENCES QUADRAS(id) ON DELETE SET NULL,
  atleta1_id UUID NOT NULL REFERENCES ATLETAS(id) ON DELETE RESTRICT,
  atleta2_id UUID REFERENCES ATLETAS(id) ON DELETE SET NULL,
  atleta3_id UUID REFERENCES ATLETAS(id) ON DELETE RESTRICT,
  atleta4_id UUID REFERENCES ATLETAS(id) ON DELETE SET NULL,
  data_agendada DATE NOT NULL,
  horario_agendado TIME NOT NULL,
  status status_partida_enum DEFAULT 'agendada' NOT NULL,
  placar_set1 VARCHAR(10),
  placar_set2 VARCHAR(10),
  placar_set3 VARCHAR(10),
  vencedor_id UUID REFERENCES ATLETAS(id) ON DELETE SET NULL,
  tempo_aquecimento INTEGER,
  tempo_partida INTEGER,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE tipo_financeiro_enum AS ENUM ('receita_inscricao', 'patrocinio', 'despesa_quadra', 'despesa_arbitragem', 'despesa_equipe', 'despesa_premio', 'brinde', 'outro');
CREATE TABLE CONTROLE_FINANCEIRO (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneio_id UUID NOT NULL REFERENCES TORNEIOS(id) ON DELETE CASCADE,
  tipo tipo_financeiro_enum NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  data_lancamento DATE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TYPE evento_partida_enum AS ENUM ('aquecimento_iniciado', 'aquecimento_finalizado', 'partida_iniciada', 'partida_finalizada', 'resultado_registrado');
CREATE TABLE HISTORICO_PARTIDAS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partida_id UUID NOT NULL REFERENCES PARTIDAS(id) ON DELETE CASCADE,
  evento evento_partida_enum NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  dados_adicionais JSONB DEFAULT '{}' NOT NULL
);
