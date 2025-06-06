import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id_product: "",
    name: "",
    current_price: "",
    description: "",
    type: "",
    stock: "",
    stock_min: "",
    stock_max: "",
    image: "", 
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/api/products/${editingId}`
      : `http://localhost:3000/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al guardar producto");

      setFormData({
        id_product: "",
        name: "",
        current_price: "",
        description: "",
        type: "",
        stock: "",
        stock_min: "",
        stock_max: "",
        image: "",
      });
      setEditingId(null);
      fetchProducts();
      setMessage("✔ Producto guardado exitosamente.");
      setError("");
    } catch (error) {
      setMessage("");
      setError("❌ Error al guardar el producto. Intenta de nuevo.");
      console.error(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `¿Eliminar producto #${id}?`,
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#2a2a2a",
        color: "#ffffff",
        customClass: {
          htmlContainer: "text-left",
        },
      });

      if (!isConfirmed) return;

      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      fetchProducts();

      await Swal.fire({
        title: "¡Eliminado!",
        text: "El producto ha sido eliminado correctamente",
        icon: "success",
        background: "#2a2a2a",
        color: "#ffffff",
        timer: 1000,
        showConfirmButton: false,
      });

      setMessage("✔ Producto eliminado correctamente.");
      setError("");
    } catch (error) {
      setMessage("");
      setError("❌ Error al eliminar el producto.");
      console.error(error.message);
    }
  }

  function handleEdit(product) {
    const {
      id_product,
      name,
      current_price,
      description,
      type,
      stock,
      stock_min,
      stock_max,
      image, 
    } = product;
    setFormData({
      id_product,
      name,
      current_price,
      description,
      type,
      stock,
      stock_min,
      stock_max,
      image: image || "", 
    });
    setEditingId(id_product);
    setMessage("");
    setError("");
  }

  const placeholders = {
    id_product: "ID del producto",
    name: "Nombre",
    current_price: "Precio actual",
    description: "Descripción",
    type: "Tipo",
    stock: "Stock",
    stock_min: "Stock mínimo",
    stock_max: "Stock máximo",
    image: "URL de la imagen", 
  };

  return (
    <div className="w-full px-6">
      <div className="w-full max-w-6xl mx-auto text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-[0_0_10px_2px_#facc15]">
            <h2 className="text-2xl font-bold mb-4 text-[#D49C2E]">
              {editingId ? "Editar Producto" : "Agregar Producto"}
            </h2>
            {message && (
              <p className="mb-2 text-green-400 font-semibold">{message}</p>
            )}
            {error && (
              <p className="mb-2 text-red-500 font-semibold">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <input
                    type={
                      key.includes("price") || key.includes("stock")
                        ? "number"
                        : "text"
                    }
                    value={value}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    placeholder={placeholders[key] || key.replace(/_/g, " ")}
                    className="w-full p-2 rounded bg-[#1f1f1f] text-white focus:ring-2 focus:ring-[#D49C2E]"
                    required={key !== "image"} 
                  />
                  {key === "image" && value && (
                    <div className="mt-2">
                      <p className="text-sm mb-1">Vista previa:</p>
                      <img
                        src={value}
                        alt="Vista previa de la imagen"
                        className="max-h-20 rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/100?text=Imagen+no+disponible";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-[#D49C2E] text-black font-semibold py-2 rounded hover:bg-[#b38224] transition"
              >
                {editingId ? "Actualizar Producto" : "Agregar Producto"}
              </button>
            </form>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-[0_0_10px_2px_#facc15]">
            <h2 className="text-2xl font-bold mb-6 text-[#D49C2E]">
              Productos
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {products.map((product) => (
                <div
                  key={product.id_product}
                  className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/100?text=Imagen+no+disponible";
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-400">
                        Precio: ${product.current_price} | Stock:{" "}
                        {product.stock}
                      </p>
                      <p className="text-sm text-gray-500 italic">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-[#D49C2E] text-black rounded hover:bg-[#b38224] transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id_product)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;