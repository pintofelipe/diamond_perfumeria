const pool = require("../pgconnection.cjs");

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM diamond.products ORDER BY id_product");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Crear nuevo producto
const createProduct = async (req, res) => {
  try {
    const {
      id_product,
      name,
      current_price,
      description,
      type,
      stock,
      stock_min,
      stock_max,
    } = req.body;

    await pool.query(
      `INSERT INTO diamond.products 
        (id_product, name, current_price, description, type, stock, stock_min, stock_max)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id_product, name, current_price, description, type, stock, stock_min, stock_max]
    );

    res.status(201).json({ message: "Producto insertado con éxito" });
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).json({ error: "Error al insertar producto" });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      current_price,
      description,
      type,
      stock,
      stock_min,
      stock_max,
    } = req.body;

    await pool.query(
      `UPDATE diamond.products SET
        name=$1, current_price=$2, description=$3, type=$4,
        stock=$5, stock_min=$6, stock_max=$7
        WHERE id_product=$8`,
      [name, current_price, description, type, stock, stock_min, stock_max, id]
    );

    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM diamond.products WHERE id_product = $1", [id]);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

module.exports = {getAllProducts,createProduct,updateProduct,deleteProduct,};
