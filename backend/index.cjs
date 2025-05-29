const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.cjs");
const customerRoutes = require("./routes/customers.cjs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});