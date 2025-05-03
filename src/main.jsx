import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartProvider.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Cart from "./components/Cart.jsx";
import Index from "./components/index.jsx";
import Checkout from "./components/Checkout.jsx";
import Confirmation from "./components/Confirmation.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Index" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Confirmation" element={<Confirmation />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);