// login.js

const express = require('express');
const router = express.Router();
const users = require('../src/json/login.json');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * from sia.usuarios where email = $1 and password = $2', [email, password]);
  const usuario = users.find(u => u.email === email && u.password === password);

  if (usuario) {
    res.json({ mensaje: 'Login exitoso', usuario });
  } else {
    res.json({ mensaje: 'Usuario no registrado' });
  }
});

module.exports = router;
