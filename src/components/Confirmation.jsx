import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const Confirmation = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Revisar si hay una sesion activa
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirecciona a login si no hay sesion activa
      navigate("/Login", { state: { from: location.pathname } });
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/Login");
  };

  if (!user) {
    return null;
  }

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

  const totalOldPrices = cart.reduce(
    (sum, product) =>
      product.oldPrice !== null
        ? sum + parsePrice(product.oldPrice) * product.quantity
        : sum,
    0
  );

  const subtotal = totalPrice;
  const shipping = 0;
  const total = subtotal + shipping;

  const returnToStore = (e) => {
    e.preventDefault();
    clearCart(); 
    navigate("/Index");
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col relative">
      <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-4xl italic font-semibold text-[#D49C2E]">
            Diamond
          </span>
          <img src="/Diamond2.png" alt="Logo" width={52} height={52} className="text-[#D49C2E]"/>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition flex items-center gap-2"onClick={() => setShowDropdown(!showDropdown)}>
              <span className="text-[#D49C2E] font-medium px-2">
                {(user.nombres || user.email.split('@')[0]).toUpperCase()}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#D49C2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2b2b2b] rounded-md shadow-lg z-10 border border-[#D49C2E]">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-white border-b border-[#D49C2E]">
                    <p className="font-semibold">{user.nombres} {user.apellidos}</p>
                    <p className="text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={handleLogout}className="block w-full px-4 py-2 text-sm text-white hover:bg-[#D49C2E] hover:text-black text-left">
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center px-6 py-8 flex-grow">
        <div className="max-w-2xl w-full bg-[#2b2b2b] rounded-lg p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#D49C2E] mb-2">
              ¡Pedido confirmado!
            </h1>
            <p className="text-gray-400">
              Gracias por tu compra. Hemos enviado los detalles a tu correo electrónico.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#D49C2E]">
              Resumen del pedido
            </h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      {item.oldPrice && (
                        <span className="text-gray-400 line-through text-sm">{formatCOP(parsePrice(item.oldPrice))}</span>
                      )}
                      <span className="text-gray-400">{item.quantity} × {formatCOP(parsePrice(item.price))}</span>
                    </div>
                  </div>
                  <span>{formatCOP(parsePrice(item.price) * item.quantity)}</span>
                </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatCOP(subtotal)}</span>
                </div>

                {totalOldPrices > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 ">Descuento en productos:</span>
                    <span className="text-gray-400 line-through">{formatCOP(totalOldPrices)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span className="text-[#D49C2E]">{formatCOP(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>{formatCOP(total)}</span>
                </div>
            </div>
          </div>

          <button onClick={returnToStore} className="w-full py-2 bg-[#D49C2E] text-black rounded-lg font-semibold shadow-md hover:bg-[#fde047] cursor-pointer transition">
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;