require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSeed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Seeding DB...');

    // Limpar tabelas para reset limpo
    await client.query(`
      TRUNCATE TABLE HISTORICO_PARTIDAS, PAGAMENTOS, INSCRICOES, PARTIDAS, CHAVEAMENTOS, QUADRAS, CATEGORIAS, TORNEIOS, ATLETAS, USUARIOS RESTART IDENTITY CASCADE;
    `);

    // 1. Criar admin
    const hash = await bcrypt.hash('Daniel0306', 10);
    const userRes = await client.query(
      `INSERT INTO USUARIOS (nome, email, cpf, telefone, tipo_usuario, senha_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['Daniel Baumann', 'baumann@viva.com.br', '12345678901', '21999999999', 'admin', hash]
    );
    const adminId = userRes.rows[0].id;

    // 2. Criar torneio
    const tornRes = await client.query(
      `INSERT INTO TORNEIOS (nome, descricao, data_inicio, data_fim, local, numero_quadras, horario_inicio, horario_fim, status, criado_por) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      ['Copa Elite Copacabana 2026', 'Torneio Master Series de Beach Tennis', '2026-12-01', '2026-12-04', 'Praia de Copacabana', 8, '08:00', '22:00', 'em_andamento', adminId]
    );
    const torneioId = tornRes.rows[0].id;

    // 3. Criar quadras
    for (let i = 1; i <= 8; i++) {
      await client.query(`INSERT INTO QUADRAS (torneio_id, numero, localizacao) VALUES ($1, $2, $3)`, [torneioId, i, `Setor ${i}`]);
    }

    // 4. Criar categorias
    const catPro = await client.query(`INSERT INTO CATEGORIAS (torneio_id, nome, tipo_chave, nivel_tecnico, faixa_etaria, numero_vagas, valor_inscricao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [torneioId, 'Pro Masculino', 'duplas_masc', 'profissional', 'open', 32, 400.00]);
    const catA = await client.query(`INSERT INTO CATEGORIAS (torneio_id, nome, tipo_chave, nivel_tecnico, faixa_etaria, numero_vagas, valor_inscricao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [torneioId, 'Amador A', 'duplas_masc', 'A', 'open', 24, 250.00]);

    const catProId = catPro.rows[0].id;
    const catAId = catA.rows[0].id;

    // 5. Criar chaveamentos para essas categorias
    const chaveProRes = await client.query(`INSERT INTO CHAVEAMENTOS (torneio_id, categoria_id, tipo) VALUES ($1, $2, $3) RETURNING id`, [torneioId, catProId, 'eliminatoria_simples']);
    const chaveProId = chaveProRes.rows[0].id;

    // 6. Criar Atletas
    const atl1 = await client.query(`INSERT INTO ATLETAS (usuario_id, nome_completo, cpf, email, telefone, data_nascimento, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [adminId, 'Gabriel Medina', '11111111111', 'a@a.com', '11', '1993-12-22', 'masculino']);
    const atl2 = await client.query(`INSERT INTO ATLETAS (usuario_id, nome_completo, cpf, email, telefone, data_nascimento, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [adminId, 'Felipe Toledo', '22222222222', 'b@a.com', '11', '1995-04-16', 'masculino']);
    const atl3 = await client.query(`INSERT INTO ATLETAS (usuario_id, nome_completo, cpf, email, telefone, data_nascimento, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [adminId, 'Bruno Magalhães', '33333333333', 'c@a.com', '11', '1990-01-01', 'masculino']);
    const atl4 = await client.query(`INSERT INTO ATLETAS (usuario_id, nome_completo, cpf, email, telefone, data_nascimento, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [adminId, 'André Santos', '44444444444', 'd@a.com', '11', '1992-02-02', 'masculino']);

    // 7. Criar Partida
    const quadraRes = await client.query(`SELECT id FROM QUADRAS WHERE torneio_id = $1 LIMIT 1`, [torneioId]);
    await client.query(`
      INSERT INTO PARTIDAS (chaveamento_id, quadra_id, atleta1_id, atleta2_id, atleta3_id, atleta4_id, data_agendada, horario_agendado, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [chaveProId, quadraRes.rows[0].id, atl1.rows[0].id, atl2.rows[0].id, atl3.rows[0].id, atl4.rows[0].id, '2026-12-01', '08:00', 'agendada']);

    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seeding error:', e);
  } finally {
    client.release();
    pool.end();
  }
}

runSeed();
