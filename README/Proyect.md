
## Diamomd Perfumeria

# 📖 Descripción General

**Diamond Perfumería** es una plataforma integral desarrollada como solución para la gestión eficiente de un negocio de venta de perfumes. Esta aplicación permite a los usuarios explorar un catálogo dinámico de productos, gestionar el carrito de compras, interactuar con un chatbot inteligente y administrar el inventario desde un panel administrativo.

El objetivo del proyecto es digitalizar y optimizar la experiencia de compra, brindando una interfaz moderna, animada e intuitiva para los clientes y herramientas funcionales para los administradores del sistema.

El sistema está dividido en dos partes:

- **Frontend:** una SPA (Single Page Application) construida en React, con diseño responsive, animaciones mediante `framer-motion`, y un enfoque centrado en la experiencia del usuario.
- **Backend:** construido en Node.js con Express, utilizando PostgreSQL como base de datos relacional, asegurando integridad de datos, relaciones entre entidades (clientes, productos, promociones) y validaciones robustas.

Entre sus componentes clave se encuentran:
- Un CRUD de productos con validaciones de stock y precios.
- Un sistema de autenticación de clientes con JWT.
- Un chatbot animado que responde consultas frecuentes.
- Un carrito de compras persistente conectado al contexto global.
- Un entorno visual oscuro con diseño personalizado para mejorar la usabilidad y reducir fatiga visual.

Este proyecto fue desarrollado como parte de un ejercicio académico de desarrollo full stack, y puede servir como base para tiendas en línea de productos físicos o como referencia para aplicaciones con administración de inventario y atención al cliente automatizada.


## Authors

- [Juan Jose Garcia Torres](https://github.com/JuanJggg)

- [Andrey Felipe Pinto Uribe](https://github.com/pintofelipe)

- [Juan Sebastian Meza](https://github.com/JuanMeza21)


## Deployment

To deploy this project run

```bash

  diamond_perfumeria/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   └── pgconnection.cjs
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── App.jsx
│   └── index.html


GET     /api/products
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id

npm install react react-dom
npm install react-router-dom
npm install framer-motion
npm install express
npm install cors
npm install pg

```


## Feedback

🟨 Fortalezas del proyecto:
✅ 1. Diseño visual llamativo

    La interfaz oscura con detalles dorados le da una estética elegante y profesional.

    Uso de framer-motion para animaciones en el inventario y el chatbot: esto mejora la experiencia de usuario.

✅ 2. Funcionalidad completa de CRUD

    Puedes agregar, editar y eliminar productos desde una vista administrativa bien definida.

    Conexión a PostgreSQL organizada a través de controladores y rutas.

✅ 3. Chatbot integrado

    Tiene un asistente virtual con mensajes personalizados y animación.

    Interfaz tipo WhatsApp con entrada de usuario y respuestas automáticas, lo cual es moderno e intuitivo.

✅ 4. Separación de backend y frontend

    El proyecto sigue una arquitectura modular: rutas, controladores, y conexión de base de datos separada.

✅ 5. Control de sesión

    Muestra el nombre del usuario logueado y tiene control de logout.

    Persistencia con localStorage.

🔴 Áreas de mejora:
⚠️ 1. Código duplicado o no usado

    Variables como cart estaban declaradas pero no utilizadas en algunos puntos.

    Algunos useState quedaron huérfanos tras refactorizaciones (ej. products, showDropdown).

⚠️ 2. Responsividad

    En algunas vistas, los productos no se alineaban correctamente o se veían desbalanceados.

    Podría añadirse soporte responsive completo (media queries o tailwind responsive utilities).

⚠️ 3. Validación en formularios

    Los formularios permiten guardar datos inválidos si no se usan validaciones del lado del cliente.

    Sugerencia: usar algo como Yup + react-hook-form o validación manual en el handleSubmit.

⚠️ 4. Reglas para el chatbot

    Las respuestas automáticas podrían extenderse usando expresiones regulares o un árbol de decisiones básico para mejorar la utilidad.

🧠 Sugerencias adicionales:

    Imagenes en productos: Soporte para cargar/mostrar imágenes reales de los productos.

    Notificaciones: Incorporar toast o alertas flotantes para feedback (agregado, error, etc.).

    Internacionalización: Estructura básica si se quiere escalar a otros idiomas.

    Documentación técnica: Ya iniciaste un README; completar el despliegue y uso del backend, entorno de desarrollo y contribuciones sería ideal.
