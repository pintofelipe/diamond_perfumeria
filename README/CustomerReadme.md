# Módulo de gestión de clientes

Este módulo maneja la administración de usuarios, permitiendo consultar, crear, actualizar y eliminar clientes. Utiliza **Node.js con Express** para el backend y **React** para el frontend, con **PostgreSQL** como base de datos. Las contraseñas se almacenan de forma segura usando **bcrypt**.

---

## Backend (Node.js con Express y PostgreSQL)

El backend interactúa directamente con la tabla `DIAMOND.CUSTOMERS` de PostgreSQL.

### Endpoints y funcionalidades

#### GET /api/customers

- **Función:** `obtenerClientes`  
- **Descripción:** Devuelve una lista de todos los clientes registrados, excluyendo sus contraseñas por seguridad.  
- **Respuesta Exitosa:** `200 OK` con un arreglo de clientes.

---

#### GET /api/customers/:id

- **Función:** `obtenerClientePorId`  
- **Descripción:** Obtiene los detalles de un cliente específico utilizando su `id_customer`.  
- **Respuesta Exitosa:** `200 OK` con los datos del cliente.  
- **Errores:** `404 Not Found` si el cliente no existe.

---

#### POST /api/customers

- **Función:** `crearCliente`  
- **Descripción:** Registra un nuevo cliente. Genera un ID (`C001`, `C002`, etc.) y hashea la contraseña con **bcrypt**. Valida que el email no esté ya registrado.  
- **Parámetros `req.body`:** `first_name`, `last_name`, `phone`, `email`, `password`, `role` (opcional, por defecto `"cliente"`).  
- **Respuesta Exitosa:** `201 Created` con el ID y datos básicos del nuevo cliente.  
- **Errores:** `400 Bad Request` si faltan campos o el email ya existe.

---

#### PUT /api/customers/:id

- **Función:** `actualizarCliente`  
- **Descripción:** Modifica la información de un cliente existente por su ID. **No permite cambiar la contraseña.** Valida que el email no sea haya tomado por otro cliente.  
- **Parámetros `req.body`:** `first_name`, `last_name`, `phone`, `email`, `role`.  
- **Respuesta Exitosa:** `200 OK` con los datos actualizados del cliente.  
- **Errores:**  
  - `400 Bad Request` si faltan campos o el email ya está en uso  
  - `404 Not Found` si el cliente no existe

---

#### DELETE /api/customers/:id

- **Función:** `eliminarCliente`  
- **Descripción:** Elimina un cliente de la base de datos utilizando su ID.  
- **Respuesta Exitosa:** `200 OK` con un mensaje de confirmación y el ID del cliente eliminado.  
- **Errores:** `404 Not Found` si el cliente no existe.

---

## Frontend (React): `GestionClientes.jsx`

Este componente de React proporciona la interfaz de usuario para interactuar con el backend y gestionar los clientes.

### Interacción con endpoints

El componente `GestionClientes.jsx` hace las siguientes acciones:

- **Carga inicial:**  
  Utiliza `useEffect` para llamar a `GET /api/customers` y mostrar la lista completa de clientes al cargar la página.

- **Búsqueda:**  
  Permite buscar clientes por correo electrónico. Los resultados se filtran en el frontend a partir de la lista cargada.

- **Creación:**  
  Al enviar el formulario de "Agregar cliente", realiza una petición `POST` a `/api/customers`.  
  Antes de enviar, **valida localmente** los datos de entrada (campos obligatorios, formatos de email/teléfono, seguridad de contraseña).

- **Edición:**  
  Cuando un cliente es seleccionado para editar, el formulario se precarga con sus datos.  
  Al guardar los cambios, se envía una petición `PUT` a `/api/customers/:id`.  
  La validación local se aplica, pero **no se requiere la contraseña**.

- **Eliminación:**  
  Al hacer clic en "Eliminar", se muestra una confirmación (SweetAlert2) y, si se aprueba, se envía una petición `DELETE` a `/api/customers/:id`.

---

### Características

- **Validación de formulario:**  
  Implementa validaciones detalladas en el cliente (`validarDatos`) para ofrecer feedback instantáneo al usuario.

- **Manejo de estado:**  
  Utiliza `useState` para gestionar los datos del formulario, la lista de clientes, los errores y la búsqueda.

- **Alertas:**  
  Emplea **SweetAlert2** para confirmaciones de eliminación y mensajes de éxito/error, mejorando la experiencia del usuario.
