import { useState, useEffect } from "react";

function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    contrasena: "",
    rol: "Cliente",
  });
  const [idEditando, setIdEditando] = useState(null);
  const [error, setError] = useState("");
  const [busquedaCorreo, setBusquedaCorreo] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState({});

  useEffect(() => {
    if (busquedaCorreo.trim() !== "") {
      const resultados = clientes.filter((cliente) => {
        const correo = cliente.email || cliente.correo || "";
        return correo.toLowerCase().includes(busquedaCorreo.toLowerCase());
      });
      setClientesFiltrados(resultados);
      setMostrandoResultados(true);
    } else {
      setMostrandoResultados(false);
      setClientesFiltrados([]);
    }
  }, [busquedaCorreo, clientes]);

  // Obtener clientes
  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/api/customers");
        if (!respuesta.ok) throw new Error("Error al obtener clientes");
        const datos = await respuesta.json();
        setClientes(datos.customers);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setError("Error al cargar los clientes");
      }
    };
    obtenerClientes();
  }, []);

  const validarDatos = () => {
    const nuevosErrores = {};
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[0-9]{7,15}$/;
    const regexContrasena = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Validación de nombre
    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (datosFormulario.nombre.length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validación de apellido
    if (!datosFormulario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    } else if (datosFormulario.apellido.length < 2) {
      nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    // Validación de teléfono
    if (!datosFormulario.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!regexTelefono.test(datosFormulario.telefono)) {
      nuevosErrores.telefono =
        "Teléfono no válido (solo números, 7-15 dígitos)";
    }

    // Validación de correo
    if (!datosFormulario.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!regexCorreo.test(datosFormulario.correo)) {
      nuevosErrores.correo = "Correo electrónico no válido";
    }

    // Validación de contraseña (solo si es nuevo cliente)
    if (!idEditando) {
      if (!datosFormulario.contrasena.trim()) {
        nuevosErrores.contrasena = "La contraseña es obligatoria";
      } else if (!regexContrasena.test(datosFormulario.contrasena)) {
        nuevosErrores.contrasena =
          "La contraseña debe tener al menos 8 caracteres, una letra y un número";
      }
    }

    setErroresValidacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error de validación cuando el usuario escribe
    if (erroresValidacion[name]) {
      setErroresValidacion((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[name];
        return nuevosErrores;
      });
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");

    // Validar datos antes de enviar
    if (!validarDatos()) {
      return;
    }

    try {
      const url = idEditando
        ? `http://localhost:3000/api/customers/${idEditando}`
        : "http://localhost:3000/api/customers";

      const metodo = idEditando ? "PUT" : "POST";

      // Crear objeto sin contraseña si es edición
      const datosParaEnviar = {
        first_name: datosFormulario.nombre,
        last_name: datosFormulario.apellido,
        email: datosFormulario.correo,
        phone: datosFormulario.telefono,
        role: datosFormulario.rol,
      };

      // Solo agregar contraseña si es un nuevo cliente
      if (!idEditando) {
        datosParaEnviar.password = datosFormulario.contrasena;
      }

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar),
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(resultado.error || "Error en la operación");
      }

      // Actualizar lista de clientes
      const clienteActualizado = {
        ...resultado.customer,
        nombre: resultado.customer.first_name,
        apellido: resultado.customer.last_name,
        correo: resultado.customer.email,
        telefono: resultado.customer.phone,
        rol: resultado.customer.role,
      };

      if (idEditando) {
        setClientes(
          clientes.map((c) =>
            c.id_customer === idEditando ? clienteActualizado : c
          )
        );
      } else {
        setClientes([...clientes, clienteActualizado]);
      }

      // Resetear formulario
      setDatosFormulario({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        contrasena: "",
        rol: "cliente",
      });
      setIdEditando(null);
      setBusquedaCorreo("");
      setMostrandoResultados(false);
      setErroresValidacion({});
    } catch (err) {
      setError(err.message);
    }
  };

  const manejarEdicion = (cliente) => {
    setDatosFormulario({
      nombre: cliente.first_name || cliente.nombre,
      apellido: cliente.last_name || cliente.apellido,
      telefono: cliente.phone || cliente.telefono,
      correo: cliente.email || cliente.correo,
      contrasena: "",
      rol: cliente.role || cliente.rol,
    });
    setIdEditando(cliente.id_customer);
    setError("");
    setErroresValidacion({});
  };

  const manejarEliminacion = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/customers/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar cliente");

      setClientes(clientes.filter((c) => c.id_customer !== id));
      setClientesFiltrados(
        clientesFiltrados.filter((c) => c.id_customer !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-[0_0_15px_4px_rgba(255,204,0,0.4)] h-min w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#D49C2E]">
        {idEditando ? "Editar cliente" : "Gestión de clientes"}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Formulario */}
        <div className="flex-1">
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <input type="text"name="nombre"value={datosFormulario.nombre}onChange={manejarCambio}placeholder="Nombre"
                  className={`w-full p-2 rounded bg-[#1f1f1f] text-white ${
                    erroresValidacion.nombre ? "border border-red-500" : ""
                  }`}
                />
                {erroresValidacion.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {erroresValidacion.nombre}
                  </p>
                )}
              </div>

              <div>
                <input type="text"name="apellido"value={datosFormulario.apellido}onChange={manejarCambio}placeholder="Apellido"
                  className={`w-full p-2 rounded bg-[#1f1f1f] text-white ${
                    erroresValidacion.apellido ? "border border-red-500" : ""
                  }`}
                />
                {erroresValidacion.apellido && (
                  <p className="text-red-500 text-sm mt-1">
                    {erroresValidacion.apellido}
                  </p>
                )}
              </div>

              <div>
                <input type="text"name="telefono"value={datosFormulario.telefono}onChange={manejarCambio}placeholder="Teléfono"
                  className={`w-full p-2 rounded bg-[#1f1f1f] text-white ${
                    erroresValidacion.telefono ? "border border-red-500" : ""
                  }`}
                />
                {erroresValidacion.telefono && (
                  <p className="text-red-500 text-sm mt-1">
                    {erroresValidacion.telefono}
                  </p>
                )}
              </div>

              <div>
                <input type="email"name="correo"value={datosFormulario.correo}onChange={manejarCambio}placeholder="Correo electrónico"
                  className={`w-full p-2 rounded bg-[#1f1f1f] text-white ${
                    erroresValidacion.correo ? "border border-red-500" : ""
                  }`}
                />
                {erroresValidacion.correo && (
                  <p className="text-red-500 text-sm mt-1">
                    {erroresValidacion.correo}
                  </p>
                )}
              </div>

              {!idEditando && (
                <div>
                  <input 
                    type="password"
                    name="contrasena"
                    value={datosFormulario.contrasena}
                    onChange={manejarCambio}
                    placeholder="Contraseña"
                    className={`w-full p-2 rounded bg-[#1f1f1f] text-white ${
                      erroresValidacion.contrasena ? "border border-red-500" : ""
                    }`}
                    required
                  />
                  {erroresValidacion.contrasena && (
                    <p className="text-red-500 text-sm mt-1">
                      {erroresValidacion.contrasena}
                    </p>
                  )}
                </div>
              )}

              <div>
                <select name="rol"value={datosFormulario.rol}onChange={manejarCambio}className="w-full p-2 rounded bg-[#1f1f1f] text-white"><option value="Cliente">Cliente</option>
                  <option value="Admin">Administrador</option>
                </select>
              </div>
            </div>

            <button type="submit"className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition">
              {idEditando ? "Actualizar cliente" : "Agregar cliente"}
            </button>

            {idEditando && (
              <button
                type="button"
                onClick={() => {
                  setDatosFormulario({
                    nombre: "",
                    apellido: "",
                    telefono: "",
                    correo: "",
                    contrasena: "",
                    rol: "cliente",
                  });
                  setIdEditando(null);
                  setErroresValidacion({});
                }}
                className="w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-400 transition"
              >
                Cancelar edición
              </button>
            )}
          </form>
        </div>

        {/* Búsqueda y resultados */}
        <div className="flex-1">
          <div className="mb-4 bg-[#1f1f1f] px-3 py-4 rounded">
            <h3 className="text-xl font-semibold mb-3 text-[#D49C2E]">
              Buscar clientes
            </h3>
            <input type="text"placeholder="Buscar por correo"value={busquedaCorreo}onChange={(e) => setBusquedaCorreo(e.target.value)}className="w-full p-2 rounded bg-[#2a2a2a] text-white"/>
          </div>

          {mostrandoResultados && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#D49C2E]">
                Resultados ({clientesFiltrados.length})
              </h3>
              {clientesFiltrados.length === 0 ? (
                <p className="text-white text-center">
                  No se encontraron clientes con ese correo
                </p>
              ) : (
                <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {clientesFiltrados.map((cliente) => (
                    <li key={cliente.id_customer}className="border border-yellow-500 rounded p-3 text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-yellow-400">
                            {cliente.first_name} {cliente.last_name}
                          </p>
                          <p>
                            <span className="text-gray-400">Correo:</span>{" "}
                            {cliente.email}
                          </p>
                          <p>
                            <span className="text-gray-400">Teléfono:</span>{" "}
                            {cliente.phone || "No especificado"}
                          </p>
                          <p>
                            <span className="text-gray-400">Rol:</span>{" "}
                            {cliente.role === "Admin"
                              ? "Administrador"
                              : "Cliente"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-2">
                          <button onClick={() => manejarEdicion(cliente)}className="bg-yellow-500 text-black font-semibold text-xs px-3 py-1 rounded hover:bg-yellow-400 transition whitespace-nowrap">
                            Editar
                          </button>
                          <button onClick={() =>manejarEliminacion(cliente.id_customer)}className="bg-red-600 text-white font-semibold text-xs px-3 py-1 rounded hover:bg-red-400 transition whitespace-nowrap">
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionClientes;