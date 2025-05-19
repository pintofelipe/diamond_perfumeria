import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useContext(CartContext);
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

  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace(/\./g, '')) || 0;
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

  const formatCOP = (value) => value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const subtotal = totalPrice;
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col relative">
      <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/Index")}>
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

          <button className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition relative" onClick={() => navigate("/Cart")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#D49C2E] cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D49C2E] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row px-6 py-8 gap-8 flex-grow">
        <div className="md:w-2/3 bg-[#2b2b2b] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-[#D49C2E]">
            Tu carrito ({totalItems} {totalItems === 1 ? "producto" : "productos"})
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Tu carrito esta vacio</p>
              <button onClick={() => navigate("/Index")} className="mt-4 px-6 py-2 bg-[#D49C2E] text-black rounded-md hover:bg-[#c28f2a] transition">
                Ver productos
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((product) => (
                <div key={product.id} className="flex items-center gap-4 pb-6 border-b border-gray-700">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md"/>
                  <div className="flex-grow">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      {product.oldPrice && (
                        <span className="text-gray-400 line-through">{formatCOP(parsePrice(product.oldPrice))}</span>
                      )}
                      <span className="text-white">{formatCOP(parsePrice(product.price))}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer p-1 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span className="text-white">{product.quantity}</span>
                    <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer p-1 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="cursor-pointer p-1 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              ))}
              <button onClick={clearCart} className="w-max px-3 py-2 bg-[#D49C2E] text-black rounded-lg font-semibold shadow-md hover:bg-[#fde047] cursor-pointer transition">
                Limpiar carrito
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="md:w-1/3 bg-[#2b2b2b] rounded-lg p-6 h-fit sticky top-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#D49C2E]">
              Resumen del pedido
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{formatCOP(subtotal)}</span>
              </div>

              {totalOldPrices > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 ">Descuento en productos</span>
                  <span className="text-gray-400 line-through">{formatCOP(totalOldPrices)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Envío</span>
                <span className="text-[#D49C2E]">{formatCOP(shipping)}</span>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-10 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>

            <button onClick={() => navigate("/Checkout")} className="w-full mt-6 py-2 bg-[#D49C2E] text-black rounded-lg font-semibold shadow-md hover:bg-[#fde047] cursor-pointer transition">
              Ir a pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;