const jwt = require('jsonwebtoken');

// Verifica se o token JWT é válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
}

// Verifica se o usuário logado tem um dos papéis (roles) exigidos
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.tipo_usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!allowedRoles.includes(req.user.tipo_usuario) && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Permissão negada para esta ação.' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
