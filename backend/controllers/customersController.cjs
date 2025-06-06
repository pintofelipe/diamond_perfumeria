const pool = require("../pgconnection.cjs");
const bcrypt = require("bcrypt");

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_customer, first_name, last_name, phone, email, role FROM DIAMOND.CUSTOMERS ORDER BY id_customer"
    );
    res.json({ customers: result.rows });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id_customer, first_name, last_name, phone, email, role FROM DIAMOND.CUSTOMERS WHERE id_customer = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear cliente
const crearCliente = async (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    password,
    role = "cliente",
  } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    // Verificar correo antes de crear
    const emailCheck = await pool.query(
      "SELECT 1 FROM DIAMOND.CUSTOMERS WHERE email = $1 LIMIT 1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está registrado" });
    }

    // Generar ID
    const idResult = await pool.query(
      "SELECT COALESCE(MAX(SUBSTRING(id_customer, 2)::INTEGER), 0) + 1 AS next_id FROM DIAMOND.CUSTOMERS"
    );
    const nextId = `C${idResult.rows[0].next_id.toString().padStart(3, "0")}`;

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en BD
    await pool.query(
      `INSERT INTO DIAMOND.CUSTOMERS 
       (id_customer, first_name, last_name, phone, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nextId, first_name, last_name, phone, email, hashedPassword, role]
    );

    res.status(201).json({
      mensaje: "Cliente creado exitosamente",
      customer: {
        id_customer: nextId,
        first_name,
        last_name,
        phone,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, email, role } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    // Verificar correo antes de actualizar
    const emailCheck = await pool.query(
      "SELECT 1 FROM DIAMOND.CUSTOMERS WHERE email = $1 AND id_customer != $2 LIMIT 1",
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        error: "El correo electrónico ya está registrado en otro cliente",
      });
    }

    // Obtener cliente actual
    const currentClient = await pool.query(
      "SELECT * FROM DIAMOND.CUSTOMERS WHERE id_customer = $1",
      [id]
    );

    if (currentClient.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Actualizar sin modificar la contraseña
    const query = `UPDATE DIAMOND.CUSTOMERS 
                   SET first_name = $1, last_name = $2, phone = $3, 
                       email = $4, role = $5
                   WHERE id_customer = $6
                   RETURNING id_customer, first_name, last_name, phone, email, role`;

    const params = [first_name, last_name, phone, email, role, id];

    const result = await pool.query(query, params);

    res.json({
      mensaje: "Cliente actualizado exitosamente",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM DIAMOND.CUSTOMERS WHERE id_customer = $1 RETURNING id_customer",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.json({
      mensaje: "Cliente eliminado exitosamente",
      id_customer: result.rows[0].id_customer,
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

module.exports = {obtenerClientes,obtenerClientePorId,crearCliente,actualizarCliente,eliminarCliente};