const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kohi-dev-secret-change-me';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

module.exports = { requireAuth, JWT_SECRET };
