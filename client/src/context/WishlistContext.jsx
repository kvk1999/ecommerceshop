import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/http";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { loggedIn, loading: authLoading } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!loggedIn) {
      setWishlistIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get("/wishlist")
      .then((res) => setWishlistIds(res.data.map((item) => item.id)))
      .finally(() => setLoading(false));
  }, [loggedIn, authLoading]);

  const toggleWishlist = async (productId) => {
    if (!loggedIn) {
      toast.error("Please log in to use wishlist");
      return;
    }
    if (wishlistIds.includes(productId)) {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlistIds(res.data.map((item) => item.id));
      toast.success("Removed from wishlist");
    } else {
      const res = await api.post("/wishlist", { productId });
      setWishlistIds(res.data.map((item) => item.id));
      toast.success("Added to wishlist");
    }
  };

  const value = useMemo(() => ({ wishlistIds, loading, toggleWishlist }), [wishlistIds, loading]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
