const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/connection');

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
      // Find user
      const result = await db.query('SELECT * FROM USUARIOS WHERE email = $1 AND ativo = true', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas ou usuário inativo.' });
      }

      // Check password
      const isValid = await bcrypt.compare(senha, user.senha_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, tipo_usuario: user.tipo_usuario, nome: user.nome },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo_usuario: user.tipo_usuario
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  // Helper method for initial setup - creates an admin user if none exists
  async createInitialAdmin(req, res) {
    try {
      const checkAdmin = await db.query("SELECT id FROM USUARIOS WHERE tipo_usuario = 'admin' LIMIT 1");
      if (checkAdmin.rows.length > 0) {
        return res.status(400).json({ error: 'Já existe um administrador no sistema.' });
      }

      const { nome, email, cpf, telefone, senha } = req.body;
      const hash = await bcrypt.hash(senha || 'admin123', 10);

      const result = await db.query(
        `INSERT INTO USUARIOS (nome, email, cpf, telefone, tipo_usuario, senha_hash) 
         VALUES ($1, $2, $3, $4, 'admin', $5) RETURNING id, nome, email`,
        [nome || 'Admin', email || 'admin@tourneybeach.com', cpf || '00000000000', telefone || '00000000000', hash]
      );

      res.status(201).json({ message: 'Admin criado com sucesso', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar admin' });
    }
  }
  async registerAtleta(req, res) {
    const { nome, email, cpf, telefone, senha, nivel, genero, data_nascimento } = req.body;

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({ error: 'Nome, email, CPF e senha são obrigatórios.' });
    }

    try {
      await db.query('BEGIN');

      const checkUser = await db.query('SELECT id FROM USUARIOS WHERE email = $1 OR cpf = $2', [email, cpf]);
      if (checkUser.rows.length > 0) {
        await db.query('ROLLBACK');
        return res.status(400).json({ error: 'Email ou CPF já cadastrado.' });
      }

      const hash = await bcrypt.hash(senha, 10);

      // Criar usuário
      const userRes = await db.query(
        `INSERT INTO USUARIOS (nome, email, cpf, telefone, tipo_usuario, senha_hash) 
         VALUES ($1, $2, $3, $4, 'atleta', $5) RETURNING id`,
        [nome, email, cpf, telefone, hash]
      );
      const userId = userRes.rows[0].id;

      // Criar perfil de atleta associado
      await db.query(
        `INSERT INTO ATLETAS (usuario_id, nome_completo, cpf, email, telefone, genero, data_nascimento, ranking_pontos) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0)`,
        [userId, nome, cpf, email, telefone || '00000000000', genero?.toLowerCase() || 'outro', data_nascimento || '2000-01-01']
      );

      await db.query('COMMIT');
      
      res.status(201).json({ message: 'Atleta cadastrado com sucesso.' });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Erro no cadastro:', error);
      res.status(500).json({ error: 'Erro interno ao cadastrar atleta' });
    }
  }
}

module.exports = new AuthController();
