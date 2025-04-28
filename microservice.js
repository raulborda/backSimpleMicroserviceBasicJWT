// microservice.js - Servicio de números aleatorios
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT2 || 6001;

//esto es un log para la consola...
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Microservicio de números`);
  next();
});

app.use(express.json());

// Endpoint para generar números randommmmmm
app.get('/random', (req, res) => {
  try {
    // Gener0 números aleatorios entre 1 y 9
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    
    // Enviar una única respuesta (sin setTimeout)
    res.json({ 
      num1, 
      num2,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error al generar números aleatorios:', error);
    // Solo enviar respuesta de error si aún no se ha enviado una respuesta
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error interno del microservicio' });
    }
  }
});

// Endpoint de información
app.get('/health', (req, res) => {
  res.json({
    service: 'Microservicio de números aleatorios',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Microservicio de números aleatorios corriendo en http://localhost:${PORT}`);
});