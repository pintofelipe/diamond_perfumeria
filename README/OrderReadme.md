# Módulo de gestión de órdenes

El sistema permite a los administradores visualizar, buscar, actualizar el estado y eliminar órdenes de compra. Consta de un componente principal en el frontend (`OrderManagement.jsx`) que interactúa con endpoints RESTful en el backend.

---

## Backend (Node.js con Express y PostgreSQL)

El backend maneja la lógica de negocio y persistencia de las órdenes en una base de datos PostgreSQL.

### Endpoints y funcionalidades

#### GET /api/cart

- **Descripción:** Recupera todas las órdenes de compra.
- **Propósito:** Carga inicial para visualización en el panel administrativo.
- **Respuesta Exitosa:** `200 OK` con un arreglo de objetos orden.

---

#### PATCH /api/cart/{id}/status

- **Descripción:** Actualiza el estado de una orden específica.
- **Parámetros de Ruta:** `{id}` — ID de la orden.
- **Parámetros en `req.body`:**  
  ```json
  {
    "status": "Pendiente" | "Procesando" | "Enviado" | "Entregado" | "Cancelado"
  }
  ```
- **Propósito:** Gestionar el ciclo de vida de la orden.
- **Respuesta Exitosa:** `200 OK` con el objeto de la orden actualizada.

---

#### DELETE /api/cart/{id}

- **Descripción:** Elimina una orden de compra.
- **Parámetros de Ruta:** `{id}` — ID de la orden.
- **Validación Backend:** Debería permitir eliminación solo si el estado es `"Cancelado"`.
- **Propósito:** Limpieza de órdenes irrelevantes.
- **Respuesta Exitosa:** `200 OK` con confirmación de eliminación.
- **Errores posibles:**  
  - `404 Not Found` si la orden no existe.  
  - `403 Forbidden` si la orden no cumple condiciones para eliminarse.

---

## Frontend (React): Componente `OrderManagement.jsx` (`GestionOrdenes`)

Este componente representa el panel administrativo de gestión de órdenes.

### Interacción con el backend

#### Carga Inicial de órdenes

- Al montar el componente (`useEffect`), se realiza `GET /api/cart` para obtener todas las órdenes.

#### Búsqueda de órdenes

- El usuario introduce un ID de orden.
- La búsqueda se realiza localmente sobre la lista ya cargada (`ordenesFiltradas`).
- No se hace nueva solicitud al backend.

#### Actualización de estado

- Cada orden tiene un selector desplegable con los estados posibles.
- Al cambiar el estado, se ejecuta:
  ```js
  PATCH /api/cart/{id}/status
  ```
- El frontend actualiza la interfaz (idealmente de forma optimista).

#### Eliminación de órdenes

- Solo posible si la orden tiene estado `"Cancelado"`.
- Al hacer clic en "Eliminar":
  - Se muestra una doble confirmación con SweetAlert2.
  - Si se confirma, se envía:
    ```js
    DELETE /api/cart/{id}
    ```
  - Tras éxito, la orden se retira del listado y se muestra un mensaje de éxito.

---

### Características del frontend

- **Visualización detallada:**  
  Muestra ID, cliente, estado (editable), total, cantidad y productos.

- **Gestión de estados:**  
  Permite cambiar el estado de la orden desde un selector interactivo.

- **Eliminación controlada:**  
  Solo órdenes canceladas pueden eliminarse.

- **Interfaz de usuario:**  
  Estilo oscuro con acentos dorados, listas con scroll y modales estilizados.

- **Validaciones locales:**  
  El componente valida las condiciones para edición y eliminación antes de enviar al backend.

---