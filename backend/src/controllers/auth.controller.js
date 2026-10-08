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
}

module.exports = new AuthController();
