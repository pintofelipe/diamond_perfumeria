import { useNavigate } from 'react-router-dom';


function Register() {

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
      <div className="relative z-10 mt-16 p-8 bg-[#2a2a2a] rounded-xl shadow-3xl border border-[#D49C2E] shadow-[0_0_10px_2px_#facc15]">
        <img src="/Diamond2.png" alt="logo" width={90}height={90}className="text-[#facc15] m-auto"/>
        <h2 className="text-2xl font-semibold italic text-center text-[#D49C2E] mb-6">
          Registro de Usuario
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-white font-semibold italic mb-1">
            Correo
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic"
            placeholder="Ingrese un correo"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-white font-semibold italic mb-1">
            Contraseña
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic"
            placeholder="Ingrese una contraseña"
          />
        </div>

        {/* Login Button */}
        <button
          className="w-full bg-[#D49C2E] text-black font-semibold py-2 rounded-lg shadow-md hover:bg-[#fde047] transition cursor-pointer"
        >
          Iniciar Sesión
        </button>

        {/* Enlaces extra */}
        <div className="mt-4 text-sm text-center text-gray-600 flex gap-2 justify-center flex-wrap">
          <p
            className="text-[#D49C2E] font-semibold italic hover:underline cursor-pointer" onClick={() => navigate('/Login')}
          >
            ¿Ya tienes una cuenta?
          </p>
          <span>|</span>
          <p className="text-[#D49C2E] font-semibold italic hover:underline cursor-pointer" onClick={() => navigate('/')}>
            ¿Quieres volver al inicio?
          </p>
        </div>
      </div>
    </div>
  </div>
    )
}

export default Register