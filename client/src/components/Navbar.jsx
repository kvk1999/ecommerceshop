import {
  MoonStar,
  Sun,
  ShoppingCart,
  UserCircle2,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import logoSrc from "../assets/ShopSphere-logo.svg";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search, setSearch }) {
  const { cartItems } = useCart();
  const { toggleTheme, theme } = useTheme();
  const { user, loggedIn, logout } = useAuth();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="glass-card sticky top-4 z-30 border border-white/10 bg-white/80 px-5 py-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-950/80 light:border-slate-200/40 light:bg-white/95">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="ShopSphere logo"
              className="h-14 w-auto rounded-2xl border border-slate-200/30 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-slate-950/70"
            />
          </Link>
          <div className="hidden flex-col text-sm text-slate-600 dark:text-slate-400 md:flex">
            <span className="font-semibold text-slate-900 dark:text-white">ShopSphere</span>
            <span>Premium storefront</span>
          </div>
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full border border-white/10 bg-white/10 p-3 text-slate-800 transition duration-300 hover:bg-white/20 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <MoonStar className="h-5 w-5" />
              )}
            </button>

            {/* Login / Dropdown */}
            {loggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("shopsphere-user-dropdown");
                    el?.classList.toggle("hidden");
                  }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-cyan-400 light:text-slate-800 light:font-medium"
                  aria-haspopup="menu"
                  aria-label="User menu"
                >
                  {user?.name?.split(" ")[0] || "Account"}
                  <UserCircle2 className="h-5 w-5" />
                </button>

                <div
                  id="shopsphere-user-dropdown"
                  className="hidden absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl"
                  role="menu"
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-white">{user?.fullName || user?.name}</div>
                    <div className="text-xs text-slate-300">{user?.email}</div>
                  </div>
                  <div className="border-t border-white/10" />

                  <NavLink to="/account" role="menuitem" className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                    My Account
                  </NavLink>
                  <NavLink to="/orders" role="menuitem" className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                    Orders
                  </NavLink>
                  <NavLink to="/wishlist" role="menuitem" className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                    Wishlist
                  </NavLink>

                  <div className="border-t border-white/10" />

                  <button
                    type="button"
                    onClick={logout}
                    role="menuitem"
                    className="block w-full px-4 py-3 text-left text-sm text-rose-200 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 p-3 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 light:border-slate-300 light:bg-slate-200/50 light:hover:border-cyan-400"
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