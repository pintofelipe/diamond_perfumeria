import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { motion } from "framer-motion";

function Index() {
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hola 👋 ¿En qué puedo ayudarte hoy?" }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const normalizedUser = {
          ...parsedUser,
          nombre: parsedUser.first_name,
          apellido: parsedUser.last_name,
        };
        setUser(normalizedUser);
      } catch (error) {
        console.error(error);
        navigate("/Login", { state: { from: location.pathname } });
      }
    } else {
      navigate("/Login", { state: { from: location.pathname } });
    }
  }, [navigate, location]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) =>
        setProducts(data.map((p) => ({ ...p, price: p.current_price })))
      )
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const formatCOP = (value) => value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const parsePrice = (price) => {
    if (typeof price === "string") {
      return parseFloat(price.replace(/\./g, "")) || 0;
    }
    return price || 0;
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/Login");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const newMessage = { from: "user", text: chatInput };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");

    setTimeout(() => {
      let botReply = "Lo siento, ¿podrías repetirlo de otra forma?";
      if (newMessage.text.toLowerCase().includes("horario")) {
        botReply = "Nuestro horario es de 9am a 6pm 🕘";
      } else if (newMessage.text.toLowerCase().includes("metodo de pago")) {
        botReply = "Aceptamos tarjetas, efectivo y transferencias 💳";
      } else if (newMessage.text.toLowerCase().includes("envios")) {
        botReply = "Tenemos envíos a todo el país 🚚";
      }else if (newMessage.text.toLowerCase().includes("ubicacion")) {
        botReply = "Estamos ubicados en el centro comercial Diamante 💎";
      }else if (newMessage.text.toLowerCase().includes("precio")) {
        botReply = "Los precios varían según el producto. ¿Tienes alguno en mente?";
      }else if (newMessage.text.toLowerCase().includes("entrega")) {
        botReply = "Hacemos entregas en 24-48 horas hábiles.";
      }else if (newMessage.text.toLowerCase().includes("descuento")) {
        botReply = "Consulta nuestras promociones actuales en la sección de ofertas.";
      }else if (newMessage.text.toLowerCase().includes("producto")) {
        botReply = "Tenemos una gran variedad de productos de belleza.";
      }else if (newMessage.text.toLowerCase().includes("pago")) {
        botReply = "Aceptamos tarjetas, PSE y pagos contra entrega.";
      }
      setChatMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-4xl italic font-semibold text-[#D49C2E]">Diamond</span>
          <img src="/Diamond2.png" alt="Logo" width={32} height={32} />
        </div>
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <div className="relative">
            <button
              className="p-2 rounded-full border border-gray-600 hover:bg-[#3a3a3a] transition flex items-center gap-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-[#D49C2E] font-medium px-2">
                {(user?.nombre || "Usuario").toUpperCase()}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#D49C2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDropdown && user && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2b2b2b] rounded-md shadow-lg z-50 border border-[#D49C2E]">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-white border-b border-[#D49C2E]">
                    <p className="font-semibold">{user.nombre} {user.apellido}</p>
                    <p className="text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-white hover:bg-[#D49C2E] hover:text-black text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Cart Button */}
          <button className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition relative" onClick={() => navigate("/Cart")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#D49C2E] cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D49C2E] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Inventory */}
      <main className="flex justify-center px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full group">
          {products.map((product) => (
            <motion.div
              key={product.id_product}
              whileHover={{ scale: 1.05 }}
              className="bg-[#2a2a2a] rounded-2xl p-4 shadow-lg transition-all duration-300 cursor-pointer group-hover:opacity-90"
            >
              {/* Mostrar la imagen del producto */}
              <div className="w-full h-48 bg-[#1f1f1f] rounded mb-4 overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-white font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-white mb-1">Precio: {formatCOP(parsePrice(product.price))}</p>
              <p className="text-xs italic text-gray-400 mb-4">{product.description}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-[#D49C2E] text-black font-bold py-2 rounded hover:bg-[#b38224] transition"
              >
                Añadir al carrito
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Chatbot */}
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 right-6 w-80 bg-[#2b2b2b] border border-[#D49C2E] rounded-md shadow-lg p-4 z-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[#D49C2E] font-bold">Asistente Virtual</h2>
            <button onClick={() => setChatOpen(false)} className="text-red-500 font-bold">✕</button>
          </div>
          <div className="max-h-64 overflow-y-auto mb-2 space-y-1">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.from === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-sm p-2 rounded-md max-w-[80%] ${msg.from === "user" ? "bg-[#D49C2E] text-black ml-auto" : "bg-[#1f1f1f] text-white"}`}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              className="flex-1 p-2 bg-[#1f1f1f] rounded-md text-white border border-[#D49C2E]"
              placeholder="Escribe un mensaje..."
            />
            <button onClick={handleChatSend} className="bg-[#D49C2E] p-2 rounded">
              ➤
            </button>
          </div>
        </motion.div>
      )}

      {/* Chatbot toggle button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[#D49C2E] flex items-center justify-center text-black text-xl shadow-md hover:scale-110 transition"
      >
        💬
      </button>
    </div>
  );
}

export default Index;
