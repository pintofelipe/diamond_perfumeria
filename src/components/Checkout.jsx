import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice } = useContext(CartContext);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    expirationDate: "",
    cvv: ""
  });

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

  const validateFields = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Requerido";
    if (!formData.email) newErrors.email = "Requerido";
    if (!formData.phone) newErrors.phone = "Requerido";
    if (!formData.address) newErrors.address = "Requerido";
    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Requerido";
      if (!formData.expirationDate) newErrors.expirationDate = "Requerido";
      if (!formData.cvv) newErrors.cvv = "Requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setTimeout(() => {
      navigate("/Confirmation");
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    if (errors[name]) setErrors({...errors, [name]: null});
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col relative">
      <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-4xl italic font-semibold text-[#D49C2E]">Diamond</span>
          <img src="/Diamond2.png" alt="Logo" width={52} height={52} className="text-[#D49C2E]"/>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition" onClick={() => navigate("/Login")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#D49C2E] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A10.95 10.95 0 0112 15c2.45 0 4.71.78 6.879 2.103M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row px-6 py-8 gap-8 flex-grow">
        <div className="md:w-2/3 bg-[#2b2b2b] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-[#D49C2E]">Información de pago</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Nombre</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.name?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                {errors.name&&<p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Correo electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.email?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                {errors.email&&<p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Teléfono</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.phone?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                {errors.phone&&<p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Dirección</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.address?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                {errors.address&&<p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#D49C2E]">Método de pago</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#3a3a3a] rounded-md border border-gray-600">
                  <input type="radio" id="credit-card" name="paymentMethod" value="credit-card" checked={formData.paymentMethod === "credit-card"} onChange={handleInputChange} className="text-[#D49C2E] focus:ring-[#D49C2E]"/>
                  <label htmlFor="credit-card" className="flex-grow cursor-pointer">Tarjeta de crédito/débito</label>
                  <div className="flex gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="w-8 h-5 object-contain"/>
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="w-8 h-5 object-contain"/>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#3a3a3a] rounded-md border border-gray-600">
                  <input type="radio" id="paypal" name="paymentMethod" value="paypal" checked={formData.paymentMethod === "paypal"} onChange={handleInputChange} className="text-[#D49C2E] focus:ring-[#D49C2E]"/>
                  <label htmlFor="paypal" className="flex-grow cursor-pointer">PayPal</label>
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174861.png" alt="PayPal" className="w-8 h-5 object-contain"/>
                </div>
              </div>

              {formData.paymentMethod === "credit-card" && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Número de tarjeta</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.cardNumber?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                    {errors.cardNumber&&<p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Fecha de expiración</label>
                      <input type="text" name="expirationDate" value={formData.expirationDate} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.expirationDate?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                      {errors.expirationDate&&<p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">CVV</label>
                      <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-md bg-[#3a3a3a] border ${errors.cvv?"border-red-500":"border-gray-600"} text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]`}/>
                      {errors.cvv&&<p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="md:w-1/3 bg-[#2b2b2b] rounded-lg p-6 h-fit sticky top-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#D49C2E]">Resumen del pedido</h2>
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
          <div className="space-y-4 border-t border-gray-700 pt-4">
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

            <div className="flex justify-between text-lg font-semibold pt-4">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full mt-6 py-2 bg-[#D49C2E] text-black rounded-lg font-semibold shadow-md hover:bg-[#fde047] cursor-pointer transition">
            Confirmar pedido
          </button>
          <p className="text-xs text-gray-500 mt-4">Al completar tu compra, aceptas nuestros términos de servicio y política de privacidad.</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;