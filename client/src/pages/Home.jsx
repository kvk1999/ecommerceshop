import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/http";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";
import ChatbotHelp from "../components/ChatbotHelp";

export default function Home() {
  const { search } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [icons, setIcons] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api
        .get("/products")
        .then((res) => {
          // API may return either an array or an object containing products
          const data = res?.data;
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.products)
              ? data.products
              : [];
          setProducts(list);
        })
        .catch(() => setProducts([])),
      api
        .get("/icons")
        .then((res) => setIcons(res?.data?.icons || []))
        .catch(() => setIcons([])),
    ]).finally(() => setLoading(false));
  }, []);


  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchable = `${product.title} ${product.description} ${product.category}`.toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [category, products, search]);

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  if (loading) return <div className="pt-10"><Loader label="Loading homepage..." /></div>;

  return (
    <div className="space-y-10 pt-10">
      <ChatbotHelp />
      <section className="glass-card grid gap-10 p-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
        <div className="space-y-8">
          <span className="badge-pill border-cyan-400/20 bg-cyan-400/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-500/10 dark:text-cyan-200">
            Electronics & Gadgets
          </span>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl dark:text-white light:text-slate-950">
              Designed for modern shoppers <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">who value simplicity, style and convenience</span>
            </h1>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Find trending products, organize your favourites, manage orders with ease, and enjoy a futuristic shopping experience across every device.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">
              Shop Now
            </Link>
            <Link to="/orders" className="btn-secondary">
              View Orders
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/10 p-6 shadow-inner shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_18%)]" />
          <div className="relative flex h-full flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="badge-pill bg-white/10 text-slate-900 dark:bg-slate-950/80 dark:text-white">Hot Launch</span>
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Premium release curated for you.</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 text-center backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Fast delivery</p>
                <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">2-3 days</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 text-center backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Best offers</p>
                <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">Exclusive perks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {icons.length > 0 && (
        <section className="glass-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Popular categories</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Discover shop categories</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {icons.slice(0, 6).map((icon) => {
              const src = icon.src || icon.url || icon.asset || "";
              const key = icon.id || icon.filename || icon.url || icon.name || src;
              const label = icon.name || icon.label || icon.filename?.replace(/^icon-/, "") || "Category";

              return (
                <Link
                  key={key}
                  to="/products"
                  className="group rounded-[1.8rem] border border-white/10 bg-white/80 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-cyan-500/40 dark:hover:bg-slate-900/70"
                >
                  {src ? (
                    <img src={src} alt={label} className="mx-auto h-16 w-16 object-contain" />
                  ) : (
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800">{label.charAt(0)}</div>
                  )}
                  <p className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">{label}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="glass-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Catalog</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Featured Products</h2>
          </div>
          <FilterSidebar categories={categories} activeCategory={category} onChange={setCategory} />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
