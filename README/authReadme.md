# Módulo de autenticación de usuarios

Este módulo se encarga de la autenticación de usuarios, cubriendo el **registro** y el **inicio de sesión**. Para esto, interactúa con una base de datos **PostgreSQL**, específicamente la tabla `diamond.customers`, donde se guarda la información de los usuarios. La seguridad de las contraseñas está garantizada gracias al uso de **bcrypt** para su hashing.  
En el lado del cliente, una aplicación construida con **React** provee la interfaz de usuario, valida los formularios y gestiona la comunicación con la API de autenticación.

---

## Backend (Node.js con Express y PostgreSQL)

Este segmento describe las funciones del servidor que interactúan directamente con la base de datos para la gestión de usuarios.

### Dependencias 

- `pgconnection.cjs`: Módulo para gestionar la conexión con la base de datos PostgreSQL.
- `bcrypt`: Librería esencial para el **hashing seguro de contraseñas**, evitando su almacenamiento en texto plano.

### Funciones principales

#### `generarIdCliente()`

Genera un ID de cliente único y secuencial (ej. `C001`, `C002`, etc.).

**Funcionamiento:**

- Consulta el último `id_customer` registrado en la tabla `diamond.customers`.
- Si no hay clientes, devuelve `"C001"`.
- En caso contrario, extrae el número del último ID, lo incrementa en 1 y lo formatea a una cadena de 3 dígitos, prefijado con `"C"`.

**Propósito:**  
Se utiliza internamente para asignar automáticamente un identificador a cada nuevo usuario registrado.

---

#### `exports.register`

Maneja la lógica para el registro de nuevos usuarios.

- **Método HTTP:** `POST`
- **Endpoint:** `/api/auth/register`
- **Parámetros del `req.body`:** `nombres`, `apellidos`, `telefono`, `email`, `password`

**Funcionamiento:**

1. **Verificación de Email:**  
   Verifica si el email ya existe en la base de datos. Si lo encuentra, devuelve un error.
2. **Generación de ID y Hashing de contraseña:**  
   Genera un `id_customer` y convierte la contraseña en un hash con bcrypt (factor de costo 10).
3. **Registro:**  
   Inserta los datos del usuario en `diamond.customers`.
4. **Respuesta:**  
   - Éxito: Estado `201`, mensaje y `id_customer`.
   - Error: Estado `500`.

---

#### `exports.login`

Gestiona la lógica para el inicio de sesión de usuarios.

- **Método HTTP:** `POST`
- **Endpoint:** `/api/auth/login`
- **Parámetros del `req.body`:** `email`, `password`

**Funcionamiento:**

1. **Búsqueda de usuario:**  
   Busca un usuario por email.
2. **Verificación de contraseña:**  
   Si el usuario no existe o la contraseña no coincide (`bcrypt.compare()`), devuelve error 401.
3. **Respuesta exitosa:**  
   - Estado `200`
   - Mensaje y datos del usuario (sin la contraseña).
   - Estado `500` si ocurre un error de servidor.

---

## Frontend (React)

Este segmento describe los componentes de React que implementan las interfaces de usuario para **login** y **registro**.

### Dependencias

- `useState` (de React): Para manejar el estado local de formularios.
- `useNavigate` (de `react-router-dom`): Para navegación entre rutas.

---

### Componente `Login.jsx`

Formulario de inicio de sesión.

**Estado local:**

- `email`
- `password`
- `error`

#### Función `onLogin()`

1. **Validación:**  
   Verifica que los campos no estén vacíos y que el email tenga formato válido.
2. **Petición al Backend:**  
   POST a `http://localhost:3000/api/auth/login`.
3. **Manejo de respuesta:**
   - Si falla: muestra mensaje de error.
   - Si tiene éxito:
     - Redirige a `/Admin` (rol: `"Admin"`) o `/Index` (usuario regular).
     - Guarda rol y datos en `localStorage`.
4. **Errores de conexión:**  
   Captura y muestra si ocurre algún problema de red.
5. **UI:**  
   Diseño centrado, fondo oscuro, logo, onda SVG, campos para email/contraseña, botón y enlaces de navegación.

---

### Componente `Register.jsx`

Formulario para registrar nuevos usuarios.

**Estado Local:**

- `formData`: Objeto con campos del formulario (`nombres`, `apellidos`, `teléfono`, `email`, `password`)
- `errors`: Mensajes de error de validación

#### Función `handleChange(e)`

Actualiza `formData` y limpia errores al escribir.

#### Función `validateForm()`

1. Verifica:
   - Campos requeridos
   - Teléfono de 10 dígitos
   - Formato de email
   - Contraseña de al menos 6 caracteres
2. Devuelve `true` si todas las validaciones pasan.

#### Función `handleSubmit(e)`

1. Previene el comportamiento por defecto.
2. Llama a `validateForm()`. Si falla, no envía.
3. Envía POST a `http://localhost:3000/api/auth/register`.
4. Manejo de respuesta:
   - Email duplicado: error específico.
   - Otros errores: alerta genérica.
   - Éxito: redirige a `/Login`.
5. Captura errores de conexión.

**UI:** Formulario con campos, mensajes de error, botón para registrarse y enlaces. Diseño similar a `Login`.

---