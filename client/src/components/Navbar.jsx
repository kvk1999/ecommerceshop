import {
  Heart,
  MoonStar,
  Sun,
  ShoppingCart,
  ReceiptText,
  UserCircle2,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search, setSearch }) {
  const { wishlistIds } = useWishlist();
  const { cartItems } = useCart();
  const { toggleTheme, theme } = useTheme();
  const { user, loggedIn, logout } = useAuth();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="glass-card sticky top-4 z-30 px-5 py-4">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-slate-950 shadow-glow">
            SS
          </div>

          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            Shop
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Sphere
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-950/45 p-1.5 xl:mx-6 xl:flex-1">
          
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium tracking-[0.08em] transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium tracking-[0.08em] transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium tracking-[0.08em] transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            Wishlist
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium tracking-[0.08em] transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            Orders
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center xl:min-w-[430px] xl:justify-end">
          
          {/* Search */}
          <div className="min-w-0 flex-1 xl:w-[280px]">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Icons */}
          <div className="flex items-center justify-end gap-2 text-slate-300">

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className="relative rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
            >
              <Heart className="h-5 w-5" />

              {wishlistIds.length ? (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-[0_0_18px_rgba(244,63,94,0.7)]">
                  {wishlistIds.length}
                </span>
              ) : null}
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount ? (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.8)]">
                  {cartCount}
                </span>
              ) : null}
            </NavLink>

            {/* Orders */}
            <NavLink
              to="/orders"
              className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
            >
              <ReceiptText className="h-5 w-5" />
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <MoonStar className="h-5 w-5" />
              )}
            </button>

            {/* Login / Logout */}
            {loggedIn ? (
              <button
                onClick={logout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-cyan-400/40"
              >
                {user?.name?.split(" ")[0] || "Logout"}
              </button>
            ) : (
              <NavLink
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
              >
                <UserCircle2 className="h-5 w-5" />
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}