import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerManagement from "./CustomerManagement";
import OrderManagement from "./OrderManagement";

function Admin() {
  const [currentSection, setCurrentSection] = useState("productos");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  // Revisar si hay una sesión activa
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        const normalizedUser = {
          ...parsedUser,
          nombre: parsedUser.first_name, // Alias para compatibilidad
          apellido: parsedUser.last_name,
        };
        setUser(normalizedUser);
      } catch (error) {
        console.error(error);
        // Redirecciona a login si no hay sesión activa
        navigate("/Login", { state: { from: location.pathname } });
      }
    } else {
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

  return (
    <div className="flex justify-center items-center w-full h-screen overflow-hidden">
      <div className="bg-[#1e1e1e] relative w-full h-full flex justify-center ">
        {/* Logo Header */}
        <div className="absolute top-0 w-full p-4 flex items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="text-4xl italic font-semibold text-[#D49C2E]">
              Diamond
            </h1>
            <img
              src="/Diamond2.png"
              alt="logo"
              width={52}
              height={52}
              className="text-[#facc15]"
            />
          </div>

          {/* user buttons */}
          <div className="flex items-center gap-4 ml-auto">
            {/* User Dropdown */}
            <div className="relative">
              <button
                className="p-2 rounded-full bg-[#2b2b2b] border border-gray-600 hover:bg-[#3a3a3a] transition flex items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-[#D49C2E] font-medium px-2">
                  {user.nombre?.toUpperCase() || "USUARIO"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#D49C2E]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && user && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2b2b2b] rounded-md shadow-lg z-50 border border-[#D49C2E]">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-white border-b border-[#D49C2E]">
                      <p className="font-semibold">
                        {user.nombre} {user.apellido}
                      </p>
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
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="absolute top-20 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentSection("productos")}
            className={`px-4 py-2 rounded-t-lg ${
              currentSection === "productos"
                ? "bg-[#2a2a2a] text-[#D49C2E]"
                : "bg-[#1e1e1e] text-gray-400"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setCurrentSection("ventas")}
            className={`px-4 py-2 rounded-t-lg ${
              currentSection === "ventas"
                ? "bg-[#2a2a2a] text-[#D49C2E]"
                : "bg-[#1e1e1e] text-gray-400"
            }`}
          >
            Ventas
          </button>
          <button
            onClick={() => setCurrentSection("clientes")}
            className={`px-4 py-2 rounded-t-lg ${
              currentSection === "clientes"
                ? "bg-[#2a2a2a] text-[#D49C2E]"
                : "bg-[#1e1e1e] text-gray-400"
            }`}
          >
            Clientes
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-40 w-full flex justify-center">
          {currentSection === "productos" && (
            <div className="text-white">
              Gestión de productos (en desarrollo)
            </div>
          )}
          {currentSection === "ventas" && <OrderManagement />}
          {currentSection === "clientes" && <CustomerManagement />}
        </div>
      </div>
    </div>
  );
}

export default Admin;