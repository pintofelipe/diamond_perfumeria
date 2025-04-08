
import { useNavigate } from 'react-router-dom';
import './App.css'

function App() {

  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col relative">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
          {/* Logo + Nombre */}
          <div className="flex items-center gap-2">
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
          </div>
        </nav>
  
        {/* Contenido principal */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-[#D49C2E]">Bienvenido a Diamond</h1>
            <p className="text-gray-300 text-lg mb-6">
              Encuentra los mejores perfumes de todo el mundo
            </p>
            <button className="bg-[#D49C2E] text-black font-semibold px-6 py-3 rounded-md hover:bg-[#b38224] transition">
              Explorar Ahora
            </button>
          </div>
        </main>
  
        {/* Onda inferior */}
        <div className="absolute bottom-0 w-full">
          <svg className="absolute bottom-0 left-0 w-full text-[#D49C2E]"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1"
            d="M0,256L60,234.7C120,213,240,171,360,170.7C480,171,600,213,720,234.7C840,256,960,256,1080,245.3C1200,235,1320,213,1380,202.7L1440,192V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"></path>
          </svg>
        </div>
      </div>
  )
}

export default App
