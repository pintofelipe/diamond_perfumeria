

const express = require('express');
const cors = require('cors');
const loginRoutes = require('./login.cjs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', loginRoutes);

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
