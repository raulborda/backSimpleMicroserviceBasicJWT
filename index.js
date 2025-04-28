const express = require('express');
const axios = require('axios');
require('dotenv').config();

const { verifyToken, generateToken, authenticateUser } = require('./auth');

const app = express();
const PORT = process.env.PORT || 6000;
const NUM_SERVICE_URL = process.env.NUM_SERVICE_URL;

// Middleware
app.use(express.json());

// Middleware de registro (logging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Rutas
app.post('/login', authenticateUser, (req, res) => {
  try {
    const token = generateToken({ username: req.user.username });
    res.json({ 
      token,
      message: 'Autenticación exitosa',
      expiresIn: '1h' 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al generar el token' });
  }
});

app.get('/sum', verifyToken, async (req, res) => {
  try {
    // Realizar solicitud al microservicio de números
    const response = await axios.get(NUM_SERVICE_URL);
    const { num1, num2 } = response.data;
    
    const suma = num1 + num2;
    
    res.json({ 
      result: suma,
      operation: `${num1} + ${num2}`,
      user: req.user.username,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener números aleatorios:', error);
    res.status(500).json({ error: 'Error al realizar la operación de suma' });
  }
});

// Endpoint de información
app.get('/info', verifyToken, (req, res) => {
  res.json({
    service: 'API de suma con autenticación JWT',
    user: req.user.username,
    endpoints: [
      { path: '/login', method: 'POST', description: 'Autenticación de usuario y generación de token' },
      { path: '/sum', method: 'GET', description: 'Obtiene dos números aleatorios y devuelve su suma' },
      { path: '/info', method: 'GET', description: 'Información sobre la API' },
      { path: '/health', method: 'GET', description: 'Información sobre la salud de la API' }
    ]
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});