import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Footer() {

  const quotes = [
    "Shopping is not just buying — it’s discovering something that feels made for you.",
    "Style begins the moment you choose what represents you.",
    "Great products create great experiences for everyday life."
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mt-16 rounded-[2rem] border border-slate-200/20 bg-white/80 px-8 py-10 text-slate-900 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:text-slate-300">

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr_1fr] lg:items-start">

        {/* LEFT */}
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.34em] text-cyan-500">
            ShopSphere
          </p>

          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Modern marketplace UI for premium shopping experiences.
          </h2>

          <p className="max-w-sm leading-7 text-slate-700 dark:text-slate-400">
            A polished storefront with consistent light and dark theming,
            smooth interactions, and thoughtful spacing across every page.
          </p>
        </div>

        {/* CENTER */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
            Explore
          </h3>

          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
            <Link
              to="/"
              className="block transition hover:text-slate-900 dark:hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="block transition hover:text-slate-900 dark:hover:text-white"
            >
              Shop
            </Link>

            <Link
              to="/wishlist"
              className="block transition hover:text-slate-900 dark:hover:text-white"
            >
              Wishlist
            </Link>
            <Link
              to="/orders"
              className="block transition hover:text-slate-900 dark:hover:text-white"
            >
              Orders
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE QUOTES */}
        <div className="flex items-start justify-start lg:justify-end">
          <div className="max-w-xs rounded-3xl border border-slate-200/60 bg-slate-100/70 p-5 text-right shadow-lg transition-all duration-500 dark:border-white/10 dark:bg-white/5">

            <div className="text-4xl leading-none text-cyan-500">
              “
            </div>

            <p className="mt-2 min-h-[90px] text-sm italic leading-7 text-slate-700 transition-all duration-500 dark:text-slate-300">
              {quotes[currentQuote]}
            </p>

            {/* TOGGLE DOTS */}
            <div className="mt-4 flex justify-end gap-2">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    currentQuote === index
                      ? "bg-cyan-500 w-6"
                      : "bg-slate-400 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              ShopSphere
            </div>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 border-t border-slate-200/40 pt-6 text-center text-sm text-slate-700 dark:border-white/10 dark:text-slate-500">
        © {new Date().getFullYear()} ShopSphere. Built for modern fullstack commerce.
      </div>

    </footer>
  );
}