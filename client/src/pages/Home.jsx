import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/http";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";

export default function Home() {
  const { search } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [icons, setIcons] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products").then((res) => setProducts(res.data)),
      api.get("/icons").then((res) => setIcons(res.data.icons || []))
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
    <div className="space-y-8 pt-10">
      <section className="glass-card grid gap-10 p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center dark:border-white/10 dark:bg-slate-950/45 light:border-slate-200 light:bg-white/95">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium dark:text-violet-200 light:text-violet-700 light:bg-violet-100/50 light:border-violet-300/50">
            Fullstack Ecommerce
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl dark:text-white light:text-slate-900">
            Shop Modern Products With
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              Elegant Style
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 dark:text-slate-300 sm:text-lg light:text-slate-700">
            Browse premium products, save favorites, manage your cart, checkout without payments, and track every order through a clean fullstack workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow">
              Shop Now
            </Link>
            <Link to="/orders" className="rounded-full border dark:border-white/15 dark:bg-slate-950/35 dark:text-white light:border-slate-300 light:bg-slate-200/50 light:text-slate-800 px-6 py-3 text-sm font-semibold">
              View Orders
            </Link>
          </div>
        </div>
        <div className="glass-card relative h-[280px] overflow-hidden dark:border-white/5 dark:bg-slate-950/30 light:border-slate-200/50 light:bg-slate-100/50 p-6">
          <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-cyan-400/10 dark:via-transparent dark:to-violet-500/15 light:from-cyan-400/5 light:via-transparent light:to-violet-500/5" />
          <div className="relative flex h-full items-end justify-center">
            <div className="absolute right-5 top-5 rounded-2xl dark:border-white/10 dark:bg-slate-950/60 light:border-slate-300 light:bg-slate-200/70 px-4 py-3 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] dark:text-slate-400 light:text-slate-600">Special Offer</p>
              <p className="mt-2 text-xl font-bold dark:text-white light:text-slate-900">Up to 30% Off</p>
            </div>
            <div className="h-28 w-28 rounded-full border-[14px] border-cyan-300/80 shadow-glow" />
          </div>
        </div>
      </section>

      <section className="glass-card p-6 dark:border-white/10 dark:bg-slate-950/45 light:border-slate-200 light:bg-white/95">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] dark:text-slate-400 light:text-slate-600">Catalog</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight dark:text-white light:text-slate-900">Featured Products</h2>
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
