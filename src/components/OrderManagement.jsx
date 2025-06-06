import { useState, useEffect } from "react";

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [error, setError] = useState("");

  // Función para formatear a COP
  const formatCOP = (value) => {
    const numericValue = Number(value) || 0;
    return numericValue.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Filtrado de órdenes
  useEffect(() => {
    if (busquedaId.trim() !== "") {
      const resultados = ordenes.filter((orden) =>
        orden.id_order.toString().includes(busquedaId)
      );
      setOrdenesFiltradas(resultados);
      setMostrandoResultados(true);
    } else {
      setMostrandoResultados(false);
      setOrdenesFiltradas([]);
    }
  }, [busquedaId, ordenes]);

  // Obtener órdenes al cargar el componente
  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/api/cart");
        if (!respuesta.ok) throw new Error("Error al obtener órdenes");
        const datos = await respuesta.json();
        setOrdenes(datos);
      } catch (err) {
        console.error("Error al obtener órdenes:", err);
        setError("Error al cargar las órdenes");
      }
    };
    obtenerOrdenes();
  }, []);

  const manejarEliminacion = async (id) => {
    const orden = ordenes.find((o) => o.id_order === id);

    if (orden.status !== "cancelled") {
      alert("Solo se pueden eliminar órdenes con estado 'Cancelado'");
      return;
    }

    if (!window.confirm("¿Estás seguro de eliminar esta orden cancelada?"))
      return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) throw new Error("Error al eliminar orden");

      setOrdenes(ordenes.filter((o) => o.id_order !== id));
      setOrdenesFiltradas(ordenesFiltradas.filter((o) => o.id_order !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/cart/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nuevoEstado }),
        }
      );

      if (!respuesta.ok) throw new Error("Error al actualizar estado");

      const ordenActualizada = await respuesta.json();
      setOrdenes(
        ordenes.map((o) => (o.id_order === id ? ordenActualizada.order : o))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-[0_0_15px_4px_rgba(255,204,0,0.4)] h-min w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#D49C2E]">
        Gestión de órdenes
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded text-center">
          {error}
        </div>
      )}

      <div className="mb-4 bg-[#1f1f1f] px-3 py-4 rounded">
        <h3 className="text-xl font-semibold mb-3 text-[#D49C2E]">
          Buscar órdenes
        </h3>
        <input
          type="text"
          placeholder="Buscar por ID de orden"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2a2a] text-white"
        />
      </div>

      {mostrandoResultados ? (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-[#D49C2E]">
            Resultados ({ordenesFiltradas.length})
          </h3>
          {ordenesFiltradas.length === 0 ? (
            <p className="text-white text-center">
              No se encontraron órdenes con ese ID
            </p>
          ) : (
            <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {ordenesFiltradas.map((orden) => (
                <li
                  key={orden.id_order}
                  className="border border-yellow-500 rounded p-3 text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-yellow-400">
                        Orden #{orden.id_order}
                      </p>
                      <p>
                        <span className="text-gray-400">Cliente:</span>{" "}
                        {orden.customer_name}
                      </p>
                      <p>
                        <span className="text-gray-400">Estado:</span>
                        <select
                          value={orden.status}
                          onChange={(e) =>
                            actualizarEstado(orden.id_order, e.target.value)
                          }
                          className="ml-2 bg-[#2a2a2a] text-white rounded p-1 text-sm"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </p>
                      <p>
                        <span className="text-gray-400">Total:</span>{" "}
                        {formatCOP(orden.total)}
                      </p>
                      <p>
                        <span className="text-gray-400">Productos:</span>{" "}
                        {orden.items?.length || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => manejarEliminacion(orden.id_order)}
                      className={`text-white font-semibold text-xs px-3 py-1 rounded transition whitespace-nowrap ${
                        orden.status === "cancelled"
                          ? "bg-red-600 hover:bg-red-400"
                          : "bg-gray-500 cursor-not-allowed"
                      }`}
                      disabled={orden.status !== "cancelled"}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-[#D49C2E]">
            Todas las Órdenes ({ordenes.length})
          </h3>
          {ordenes.length === 0 ? (
            <p className="text-white text-center">No hay órdenes registradas</p>
          ) : (
            <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {ordenes.map((orden) => (
                <li
                  key={orden.id_order}
                  className="border border-yellow-500 rounded p-3 text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-yellow-400">
                        Orden #{orden.id_order}
                      </p>
                      <p>
                        <span className="text-gray-400">Cliente:</span>{" "}
                        {orden.customer_name}
                      </p>
                      <p>
                        <span className="text-gray-400">Estado:</span>
                        <select
                          value={orden.status}
                          onChange={(e) =>
                            actualizarEstado(orden.id_order, e.target.value)
                          }
                          className="ml-2 bg-[#2a2a2a] text-white rounded p-1 text-sm"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </p>
                      <p>
                        <span className="text-gray-400">Total:</span>{" "}
                        {formatCOP(orden.total)}
                      </p>
                      <p>
                        <span className="text-gray-400">Productos:</span>{" "}
                        {orden.items?.length || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => manejarEliminacion(orden.id_order)}
                      className={`text-white font-semibold text-xs px-3 py-1 rounded transition whitespace-nowrap ${
                        orden.status === "cancelled"
                          ? "bg-red-600 hover:bg-red-400"
                          : "bg-gray-500 cursor-not-allowed"
                      }`}
                      disabled={orden.status !== "cancelled"}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionOrdenes;