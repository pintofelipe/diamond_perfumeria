import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) newErrors.nombres = "Nombres son requeridos";
    if (!formData.apellidos.trim())
      newErrors.apellidos = "Apellidos son requeridos";

    if (!formData.telefono.trim()) {
      newErrors.telefono = "Teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "Teléfono debe tener 10 dígitos";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }

    if (!formData.password) {
      newErrors.password = "Contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "Contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "El email ya está registrado") {
          setErrors({
            ...errors,
            email: "Este email ya está registrado",
          });
        } else {
          alert(data.error || "Error en el registro");
        }
        return;
      }

      // Registro exitoso
      navigate("/Login");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen overflow-hidden">
      <div className="bg-[#1e1e1e] relative w-full h-full flex justify-center items-center">
        {/* Logo Header */}
        <div className="absolute top-0 w-full p-4 flex items-center space-x-2 cursor-pointer"onClick={() => navigate("/")}>
          <h1 className="text-4xl italic font-semibold text-[#D49C2E]">
            Diamond
          </h1>
          <img src="/Diamond2.png"alt="logo"width={52}height={52}className="text-[#facc15]"/>
        </div>

        {/* SVG Wave */}
        <svg className="absolute bottom-0 left-0 w-full text-[#D49C2E]"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 1440 320">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,256L60,234.7C120,213,240,171,360,170.7C480,171,600,213,720,234.7C840,256,960,256,1080,245.3C1200,235,1320,213,1380,202.7L1440,192V320H0Z"
          ></path>
        </svg>

        {/* Register Card */}
        <div className="relative z-10 mt-16 p-8 bg-[#2a2a2a] rounded-xl shadow-3xl border border-[#D49C2E] shadow-[0_0_10px_2px_#facc15]">
          <img src="/Diamond2.png"alt="logo"width={90}height={90}className="text-[#facc15] m-auto"/>
          <h2 className="text-2xl font-semibold italic text-center text-[#D49C2E] mb-6">
            Registro de Usuario
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Nombres */}
            <div className="mb-4">
              <label className="block text-white font-semibold italic mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic ${
                  errors.nombres ? "border-red-500" : ""
                }`}
                placeholder="Ingrese sus nombres"
              />
              {errors.nombres && (
                <p className="text-red-400 text-sm mt-1">{errors.nombres}</p>
              )}
            </div>

            {/* Apellidos */}
            <div className="mb-4">
              <label className="block text-white font-semibold italic mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic ${
                  errors.apellidos ? "border-red-500" : ""
                }`}
                placeholder="Ingrese sus apellidos"
              />
              {errors.apellidos && (
                <p className="text-red-400 text-sm mt-1">{errors.apellidos}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="mb-4">
              <label className="block text-white font-semibold italic mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic ${
                  errors.telefono ? "border-red-500" : ""
                }`}
                placeholder="Ingrese su teléfono"
              />
              {errors.telefono && (
                <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-white font-semibold italic mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Ingrese su correo electrónico"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-white font-semibold italic mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg shadow-2xl focus:ring-2 focus:ring-[#D49C2E] focus:outline-none transition text-amber-50 font-semibold italic ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Ingrese una contraseña"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Register Button */}
            <button type="submit"className="w-full bg-[#D49C2E] text-black font-semibold py-2 rounded-lg shadow-md hover:bg-[#fde047] transition cursor-pointer">
              Registrarse
            </button>
          </form>

          {/* Enlaces extra */}
          <div className="mt-4 text-sm text-center text-gray-600 flex gap-2 justify-center flex-wrap">
            <p className="text-[#D49C2E] font-semibold italic hover:underline cursor-pointer"onClick={() => navigate("/Login")}>
              ¿Ya tienes una cuenta?
            </p>
            <span>|</span>
            <p className="text-[#D49C2E] font-semibold italic hover:underline cursor-pointer"onClick={() => navigate("/")}>
              ¿Quieres volver al inicio?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;