// generador-numeros.js
const express = require('express');
require('dotenv').config();


const app = express();
const PORT2 = process.env.PORT2;

app.get('/random', (req, res) => {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;

  res.json({ num1, num2 });
});

app.listen(PORT2, () => {
  console.log(`Servidor de números aleatorios corriendo en http://localhost:${PORT2}`);
});
