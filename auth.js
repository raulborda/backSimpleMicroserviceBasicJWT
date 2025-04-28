// auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Verificamosssss el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado: Token inválido o expirado' });
    }
    req.user = decoded;
    next();
  });
};

// Generamos el Token JWT
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware de autenticación básica para login que podemos pasarlo en el body
const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos' });
  }

  // Aquí se podrían obtener las credenciales desde variables de entorno o una base de datos
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (username === validUsername && password === validPassword) {
    req.user = { username };
    next();
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

module.exports = {
  verifyToken,
  generateToken,
  authenticateUser
};