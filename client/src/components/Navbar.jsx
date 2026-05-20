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
import logoSrc from "../assets/ShopSphere-logo.svg";
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
    <nav className="glass-card sticky top-4 z-30 px-5 py-4 dark:border-white/10 dark:bg-slate-950/45 light:border-slate-200 light:bg-white/95">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="ShopSphere logo"
              className="h-14 w-[220px] rounded-2xl border border-slate-200 bg-white object-cover shadow-lg"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-950/45 p-1.5 dark:border-white/10 dark:bg-slate-950/45 light:border-slate-300 light:bg-slate-100/50 xl:mx-6 xl:flex-1">
          
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium tracking-[0.08em] transition ${
                isActive
                  ? "dark:bg-white dark:text-slate-950 light:bg-slate-800 light:text-white"
                  : "dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900"
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
                  ? "dark:bg-white dark:text-slate-950 light:bg-slate-800 light:text-white"
                  : "dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900"
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
                  ? "dark:bg-white dark:text-slate-950 light:bg-slate-800 light:text-white"
                  : "dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900"
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
                  ? "dark:bg-white dark:text-slate-950 light:bg-slate-800 light:text-white"
                  : "dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900"
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
          <div className="flex items-center justify-end gap-2 dark:text-slate-300 light:text-slate-700">

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className="relative rounded-full border border-white/10 bg-white/5 p-3 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-slate-400"
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
              className="relative rounded-full border border-white/10 bg-white/5 p-3 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-slate-400"
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
              className="rounded-full border border-white/10 bg-white/5 p-3 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-slate-400"
            >
              <ReceiptText className="h-5 w-5" />
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full border border-white/10 bg-white/5 p-3 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-slate-400"
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
                className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-slate-400 light:text-slate-800 light:font-medium"
              >
                {user?.name?.split(" ")[0] || "Logout"}
              </button>
            ) : (
              <NavLink
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 p-3 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-slate-400"
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