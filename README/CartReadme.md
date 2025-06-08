# Módulo del carrito de compras

El sistema de carrito de compras está compuesto por tres componentes principales en el frontend (`Cart.jsx`, `Checkout.jsx`, `Confirmation.jsx`) y un controlador en el backend (`cartController.cjs`). Juntos permiten a los usuarios:

1. Ver y gestionar productos en el carrito  
2. Procesar el pago de los productos  
3. Confirmar la compra realizada  

---

## Componentes Principales

### 1. `Cart.jsx`

**Responsabilidades:**

- Muestra los productos agregados al carrito
- Permite modificar cantidades o eliminar productos
- Muestra un resumen del pedido con subtotal, descuentos y total
- Navega al proceso de pago

**Características clave:**

- Acceso restringido a usuarios autenticados  
- Sincronización con el contexto del carrito (`CartContext.jsx`)  
- Formateo de precios en COP (Pesos Colombianos)  
- Visualización de precios originales y con descuento  
- Diseño responsive en dos columnas (productos y resumen)  

---

### 2. `Checkout.jsx`

**Responsabilidades:**

- Captura información de envío y pago
- Valida los datos del formulario
- Envía la orden al backend para su procesamiento
- Navega a la página de confirmación

**Características clave:**

- Validación de campos requeridos  
- Soporte para múltiples métodos de pago (tarjeta, PayPal)  
- Muestra resumen detallado del pedido  
- Diseño de formulario con validación visual  
- Integración con la API del backend  

---

### 3. `Confirmation.jsx`

**Responsabilidades:**

- Muestra confirmación de la compra exitosa
- Proporciona resumen detallado del pedido
- Permite volver a la tienda
- Limpia el carrito después de la compra

**Características clave:**

- Feedback visual de éxito (icono de check)  
- Resumen completo del pedido  
- Limpieza automática del carrito  
- Diseño centrado y claro  

---

### 4. `cartController.cjs` (Backend)

**Responsabilidades:**

- Crear nuevas órdenes en la base de datos
- Obtener listado de órdenes existentes
- Actualizar estado de las órdenes
- Eliminar órdenes

**Endpoints principales:**

| Método | Ruta               | Descripción                      |
|--------|--------------------|----------------------------------|
| POST   | `/api/cart`        | Crear nueva orden                |
| GET    | `/api/cart`        | Obtener todas las órdenes        |
| GET    | `/api/cart/:id`    | Obtener orden específica         |
| PUT    | `/api/cart/:id`    | Actualizar estado de una orden   |
| DELETE | `/api/cart/:id`    | Eliminar orden                   |

---

## Flujo de Trabajo

1. Agregar productos
2. Revisar carrito
3. Proceso de pago
4. Confirmación
5. Procesamiento backend

---

## Estructura de Datos

### Orden (`Order`)

| Campo             | Tipo / Descripción                              |
|------------------|--------------------------------------------------|
| `id_order`        | Autoincremental                                 |
| `user_id`         | Relación con usuario                            |
| `customer_name`   | Nombre completo del cliente                     |
| `email`           | Correo electrónico                              |
| `phone`           | Número de contacto                              |
| `address`         | Dirección de envío                              |
| `payment_method`  | Método de pago (tarjeta, PayPal, etc.)          |
| `card_number`     | Número de tarjeta (encriptado o tokenizado)     |
| `expiration_date` | Fecha de vencimiento                            |
| `cvv`             | Código de seguridad                             |
| `subtotal`        | Valor sin envío ni impuestos                    |
| `shipping`        | Costo de envío                                  |
| `total`           | Total a pagar                                   |
| `status`          | Estado del pedido (pendiente, pagado, enviado)  |

---

### Ítems de Orden (`OrderItems`)

| Campo            | Tipo / Descripción                    |
|------------------|----------------------------------------|
| `order_id`        | Relación con la orden principal        |
| `product_id`      | ID del producto adquirido              |
| `product_name`    | Nombre del producto                    |
| `product_image`   | Imagen del producto                    |
| `price`           | Precio actual del producto             |
| `old_price`       | Precio antes del descuento (si aplica) |
| `quantity`        | Cantidad adquirida                     |

---