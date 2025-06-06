const pool = require("../pgconnection.cjs");
const bcrypt = require("bcrypt");

// Generar ID de cliente (C001, C002, etc.)
async function generarIdCliente() {
  const result = await pool.query(`
    SELECT id_customer FROM diamond.customers 
    ORDER BY id_customer DESC LIMIT 1
  `);

  if (result.rows.length === 0) return "C001";

  const ultimoId = result.rows[0].id_customer;
  const numero = parseInt(ultimoId.slice(1)) + 1;
  return "C" + numero.toString().padStart(3, "0");
}

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombres, apellidos, telefono, email, password } = req.body;

    // 1. Verificar si el email ya existe
    const emailCheck = await pool.query(
      "SELECT email FROM diamond.customers WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "El email ya está registrado",
      });
    }

    // 2. Generar ID y hash de contraseña
    const id_customer = await generarIdCliente();
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Registrar el usuario
    await pool.query(
      `INSERT INTO diamond.customers 
       (id_customer, first_name, last_name, phone, email, password)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id_customer, nombres, apellidos, telefono, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      id_customer,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const result = await pool.query(
      "SELECT * FROM diamond.customers WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas",
      });
    }

    // 2. Verificar contraseña
    const usuario = result.rows[0];
    const contraseñaValida = await bcrypt.compare(password, usuario.password);

    if (!contraseñaValida) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas",
      });
    }

    // 3. Preparar respuesta (excluir password)
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      usuario: usuarioSinPassword,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  }
};