const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { requireAuth, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const insertUser = db.prepare(`
  INSERT INTO waitlist (name, email, password_hash, position)
  VALUES (@name, @email, @password_hash, @position)
`);
const getMaxPosition = db.prepare('SELECT MAX(position) AS maxPosition FROM waitlist');
const getUserByEmail = db.prepare('SELECT * FROM waitlist WHERE email = ?');
const getUserById = db.prepare('SELECT * FROM waitlist WHERE id = ?');
const countUsers = db.prepare('SELECT COUNT(*) AS total FROM waitlist');

const registerUser = db.transaction((name, email, password_hash) => {
  const { maxPosition } = getMaxPosition.get();
  const position = (maxPosition || 0) + 1;
  const info = insertUser.run({ name, email, password_hash, position });
  return { id: info.lastInsertRowid, position };
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: name, email, password.' });
  }

  try {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { position } = registerUser(name, email, password_hash);

    return res.status(201).json({
      success: true,
      message: 'Registro exitoso.',
      position,
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: email, password.' });
  }

  try {
    const user = getUserByEmail.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/api/me', requireAuth, (req, res) => {
  const user = getUserById.get(req.user.id);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado.' });
  }

  const { total } = countUsers.get();

  return res.json({
    name: user.name,
    email: user.email,
    position: user.position,
    total,
  });
});

app.listen(PORT, () => {
  console.log(`Kōhi backend escuchando en http://localhost:${PORT}`);
});
