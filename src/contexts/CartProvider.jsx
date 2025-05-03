import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import PropTypes from "prop-types";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  CartProvider.propTypes = { children: PropTypes.node.isRequired };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const precioLimpio =
      typeof item.price === "string"
        ? parseInt(item.price.replace(/\./g, ""), 10)
        : item.price;
    return sum + precioLimpio * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{cart,addToCart,removeFromCart,updateQuantity,clearCart,totalItems,totalPrice}}>
      {children}
    </CartContext.Provider>
  );
};