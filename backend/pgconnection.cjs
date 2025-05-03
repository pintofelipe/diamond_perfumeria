const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '0409156',
  port: 5432,
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al conectar a PostgreSQL:', err.message);
    res.status(500).send('Error en la conexión con PostgreSQL');
  }
});
  
  app.listen(port, () => {
    console.log('Servidor corriendo en puerto 3001');
  });