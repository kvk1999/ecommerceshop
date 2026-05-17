import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/http";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { loggedIn, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    const res = await api.get("/cart");
    setCartItems(res.data);
  }

  async function loadOrders() {
    const res = await api.get("/orders");
    setOrders(res.data);
  }

  useEffect(() => {
    if (authLoading) return;
    if (!loggedIn) {
      setCartItems([]);
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([loadCart(), loadOrders()]).finally(() => setLoading(false));
  }, [loggedIn, authLoading]);

  const addToCart = async (productId) => {
    if (!loggedIn) {
      toast.error("Please log in to add items to cart");
      return;
    }
    const res = await api.post("/cart", { productId, quantity: 1 });
    setCartItems(res.data);
    toast.success("Added to cart");
  };

  const syncCart = async (items) => {
    const res = await api.put("/cart", { items });
    setCartItems(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    setCartItems(res.data);
    toast.success("Removed from cart");
  };

  const placeOrder = async (payload) => {
    if (!loggedIn) {
      toast.error("Please log in to place an order");
      return null;
    }
    const res = await api.post("/orders", payload);
    await loadCart();
    await loadOrders();
    toast.success("Order placed successfully");
    return res.data;
  };

  const value = useMemo(
    () => ({ cartItems, orders, loading, addToCart, syncCart, removeFromCart, placeOrder }),
    [cartItems, orders, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
