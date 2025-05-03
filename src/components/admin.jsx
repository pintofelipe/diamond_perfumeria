import { useNavigate } from 'react-router-dom';


function Admin() {
    const navigate = useNavigate();
    

    return (
        <div className="flex justify-center items-center w-full h-screen overflow-hidden">
        <div className="bg-[#1e1e1e] relative w-full h-full flex justify-center items-center">
      
      {/* Logo Header */}
      <div className="absolute top-0 w-full p-4 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-4xl italic font-semibold text-[#D49C2E]">Diamond</h1>
        <img src="/Diamond2.png" alt="logo" width={52} height={52} className="text-[#facc15]"/>
      </div>

      {/* SVG Wave */}
      <svg className="absolute bottom-0 left-0 w-full text-[#D49C2E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1"
          d="M0,256L60,234.7C120,213,240,171,360,170.7C480,171,600,213,720,234.7C840,256,960,256,1080,245.3C1200,235,1320,213,1380,202.7L1440,192V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z">
          </path>
      </svg>

      {/* Login Card */}
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-[0_0_15px_4px_rgba(255,204,0,0.4)] w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#D49C2E]">Gestión de Productos</h2>

    <form className="space-y-4">
      <input type="text"name="name" placeholder="Nombre del perfume"className="w-full p-2 rounded bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
      <input type="text" name="category" placeholder="Categoría" className="w-full p-2 rounded bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
      <input type="number" name="price" placeholder="Precio" className="w-full p-2 rounded bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      <input type="number" name="stock" placeholder="Stock" className="w-full p-2 rounded bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      <input type="text" name="image" placeholder="URL de la imagen" className="w-full p-2 rounded bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />

      <button type="submit" className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition cursor-pointer" >Agregar Producto</button>
    </form>

    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3 text-[#D49C2E]">Productos:</h3>
      <ul className="space-y-2">
        <li
          className="border border-yellow-500 rounded p-3 text-white bg-[#1f1f1f] flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
        >
          <div>
            <strong>Ejemplo Perfume</strong> - Floral - $100 - Stock: 10
          </div>
          <div className="flex gap-2">
            <div className="bg-yellow-500 text-white text-xs px-5 py-3 rounded hover:bg-yellow-400 transition cursor-pointer">
                <button className="text-black font-semibold">Editar</button>
            </div>
            <div className="bg-red-600 text-white text-xs px-4 py-3 rounded hover:bg-red-400 transition cursor-pointer">
                <button className="font-semibold">Eliminar</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
 </div>
</div>
    )
}

export default Admin