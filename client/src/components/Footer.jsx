import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 rounded-[2rem] border border-slate-200/20 bg-white/80 px-8 py-10 text-slate-900 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr_1fr] lg:items-start">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.34em] text-cyan-500">ShopSphere</p>
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Modern marketplace UI for premium shopping experiences.</h2>
          <p className="max-w-sm leading-7 text-slate-700 dark:text-slate-400">
            A polished storefront with consistent light and dark theming, smooth interactions, and thoughtful spacing across every page.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Explore</h3>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
            <Link to="/" className="block hover:text-slate-900 dark:hover:text-white">Home</Link>
            <Link to="/products" className="block hover:text-slate-900 dark:hover:text-white">Shop</Link>
            <Link to="/wishlist" className="block hover:text-slate-900 dark:hover:text-white">Wishlist</Link>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Support</h3>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
            <a href="#" className="block hover:text-slate-900 dark:hover:text-white">Help Center</a>
            <a href="#" className="block hover:text-slate-900 dark:hover:text-white">Order Tracking</a>
            <a href="#" className="block hover:text-slate-900 dark:hover:text-white">Privacy</a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200/40 pt-6 text-center text-sm text-slate-700 dark:border-white/10 dark:text-slate-500">
        © {new Date().getFullYear()} ShopSphere. Built for modern fullstack commerce.
      </div>
    </footer>
  );
}
