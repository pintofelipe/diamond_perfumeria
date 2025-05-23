import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

function Index() {
  const { addToCart, cart } = useContext(CartContext); 
  const navigate = useNavigate();
  
  const products = [
    {
      id: 1,
      name: "Cepillo Revlon One S...",
      price: "269.900",
      oldPrice: null,
      image: "/images/cepillo.png",
      top: true,
      quantity: 1,
    },
    {
      id: 2,
      name: "Parches Contorno de...",
      price: "176.000",
      oldPrice: null,
      image: "/images/parches.png",
      top: true,
      quantity: 1,
    },
    {
      id: 3,
      name: "Lattafa Yara EDP for...",
      price: "311.998",
      oldPrice: "389.998",
      image: "/images/yara.png",
      top: true,
      quantity: 1,
    },
    {
      id: 4,
      name: "Perfume Good Girl Bl...",
      price: "573.000",
      oldPrice: null,
      image: "/images/goodgirl.png",
      top: true,
      quantity: 1,
    },
    {
      id: 5,
      name: "ICONIC London Lip PL...",
      price: "74.500",
      oldPrice: "149.000",
      image: "/images/iconic.png",
      top: true,
      quantity: 1,
    },
    {
      id: 6,
      name: "Messi Fragrance EDP...",
      price: "299.900",
      oldPrice: "349.900",
      image: "/images/messi.png",
      top: true,
      quantity: 1,
    },
  ];
  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col relative">
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
      {/* Logo + Nombre */}
      <div className="flex items-center gap-2" onClick={() => navigate('/')}>
        <span className="text-4xl italic font-semibold text-[#D49C2E]">Diamond</span>
        <img src="/Diamond2.png" alt="Logo" width={52} height={52} className="text-[#D49C2E]"/>
      </div>

      {/* Barra de búsqueda + botón de usuario */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 rounded-md bg-[#2b2b2b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#D49C2E]"
        />
        <button className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition" onClick={() => navigate('/Login')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#D49C2E] cursor-pointer" fill="none" viewBox="0 0 24 24"stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round"strokeLinejoin="round" d="M5.121 17.804A10.95 10.95 0 0112 15c2.45 0 4.71.78 6.879 2.103M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <button className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition relative"onClick={() => navigate("/Cart")}>
          <svg xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24"strokeWidth="1.5"stroke="currentColor"className="w-5 h-5 text-[#D49C2E] cursor-pointer">
            <path strokeLinecap="round"strokeLinejoin="round"d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D49C2E] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </nav>

    {/* Contenido principal */}
    <main className="flex-1 flex items-center justify-center m-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto group">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#2c2c2c] rounded-2xl p-4 shadow-lg transition-all duration-300 cursor-pointer transform group-hover:scale-90 hover:scale-105 hover:z-10"
          >
            {product.top && (
              <span className="bg-yellow-600 text-black text-xs px-3 py-1 rounded-full font-semibold">
                Top Venta
              </span>
            )}

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain my-4"
            />

            {product.time && (
              <div className="bg-red-600 text-white text-sm text-center py-1 rounded mb-2">
                {product.time}
              </div>
            )}

            <div className="mb-2">
              <span className="text-xl font-bold text-white">{product.price}</span>
              {product.oldPrice && (
                <span className="line-through text-sm text-gray-400 ml-2">
                  {product.oldPrice}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300">{product.name}</p>

            <button onClick={() => addToCart(product)} className="flex gap-2 items-center justify-center mt-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 w-full rounded-lg transition cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24"strokeWidth="1.5"stroke="currentColor"className="w-5 text-black h-5 text-[#D49C2E] cursor-pointer">
                <path strokeLinecap="round"strokeLinejoin="round"d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
              </svg>
              Añadir al carrito
            </button>

            <div className="flex justify-center items-center mt-4 text-yellow-500 text-xl">
              {"★★★★★".split("").map((star, i) => (
                <span key={i}>☆</span>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 mt-1">
              Sea el primero en dejar una reseña para este artículo
            </p>
          </div>
        ))}
      </div>
    </main>

    {/* Onda inferior */}
    <div className=" bottom-0 w-full">
      <svg className=" bottom-0 left-0 w-full text-[#D49C2E]"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1"
        d="M0,256L60,234.7C120,213,240,171,360,170.7C480,171,600,213,720,234.7C840,256,960,256,1080,245.3C1200,235,1320,213,1380,202.7L1440,192V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"></path>
      </svg>
    </div>
  </div>
  );
}

export default Index;