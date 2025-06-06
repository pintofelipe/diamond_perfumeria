const pool = require("../pgconnection.cjs");

// CREATE
const crearOrden = async (req, res) => {
  const {
    user_id,
    customer_name,
    email,
    phone,
    address,
    payment_method,
    card_number,
    expiration_date,
    cvv,
    subtotal,
    shipping,
    total,
    items,
  } = req.body;

  if (
    !user_id ||
    !customer_name ||
    !email ||
    !phone ||
    !address ||
    !payment_method ||
    !items ||
    items.length === 0
  ) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const idResult = await client.query(
      "SELECT COALESCE(MAX(id_order), 0) + 1 AS next_id FROM DIAMOND.ORDERS"
    );

    const orderId = idResult.rows[0].next_id;

    const orderQuery = `
        INSERT INTO DIAMOND.ORDERS (
          id_order, user_id, customer_name, email, phone, address,
          payment_method, card_number, expiration_date, cvv,
          subtotal, shipping, total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id_order
      `;

    await client.query(orderQuery, [
      orderId,
      user_id,
      customer_name,
      email,
      phone,
      address,
      payment_method,
      card_number,
      expiration_date,
      cvv,
      subtotal,
      shipping,
      total,
    ]);

    // Insertar items del carrito
    const itemQuery = `
        INSERT INTO DIAMOND.ORDER_ITEMS (
          order_id, product_id, product_name, product_image,
          price, old_price, quantity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

    for (const item of items) {
      await client.query(itemQuery, [
        orderId,
        item.product_id,
        item.product_name,
        item.product_image,
        item.price,
        item.old_price || null,
        item.quantity,
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Orden creada exitosamente",
      order: {
        id_order: orderId,
        user_id,
        customer_name,
        email,
        total,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error detallado al crear orden:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: "Error al crear la orden",
      detalle: error.message,
    });
  } finally {
    client.release();
  }
};

// READ
const obtenerOrdenes = async (req, res) => {
  try {
    const ordersResult = await pool.query(
      "SELECT * FROM DIAMOND.ORDERS ORDER BY id_order DESC"
    );

    if (ordersResult.rows.length === 0) {
      return res.status(200).json([]);
    }

    const orderIds = ordersResult.rows.map((order) => order.id_order);

    const itemsResult = await pool.query(
      `SELECT * FROM DIAMOND.ORDER_ITEMS 
         WHERE order_id = ANY($1::int[]) 
         ORDER BY order_id`,
      [orderIds]
    );

    const itemsMap = new Map();
    itemsResult.rows.forEach((item) => {
      if (!itemsMap.has(item.order_id)) {
        itemsMap.set(item.order_id, []);
      }
      itemsMap.get(item.order_id).push(item);
    });

    const ordersWithItems = ordersResult.rows.map((order) => ({
      ...order,
      items: itemsMap.get(order.id_order) || [],
    }));

    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

// READ
const obtenerOrdenPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const orderResult = await pool.query(
      "SELECT * FROM DIAMOND.ORDERS WHERE id_order = $1",
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const itemsResult = await pool.query(
      "SELECT * FROM DIAMOND.ORDER_ITEMS WHERE order_id = $1",
      [id]
    );

    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows,
    };

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({ error: "Error al obtener la orden" });
  }
};

// UPDATE
const actualizarEstadoOrden = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "El estado es requerido" });
  }

  try {
    const result = await pool.query(
      "UPDATE DIAMOND.ORDERS SET status = $1 WHERE id_order = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.status(200).json({
      mensaje: "Estado de la orden actualizado exitosamente",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar estado de la orden:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el estado de la orden" });
  }
};

// DELETE
const eliminarOrden = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM DIAMOND.ORDER_ITEMS WHERE order_id = $1", [
      id,
    ]);

    const result = await client.query(
      "DELETE FROM DIAMOND.ORDERS WHERE id_order = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    await client.query("COMMIT");

    res.status(200).json({
      mensaje: "Orden eliminada exitosamente",
      order: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar orden:", error);
    res.status(500).json({ error: "Error al eliminar la orden" });
  } finally {
    client.release();
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  eliminarOrden,
};
