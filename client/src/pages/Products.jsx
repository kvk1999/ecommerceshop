import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/http";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";

export default function Products() {
  const { search } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => {
      const searchable = `${product.title} ${product.description} ${product.category}`.toLowerCase();
      const matchesCategory = category === "All" || product.category === category;
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [category, products, search]);

  if (loading) return <div className="pt-10"><Loader label="Loading products..." /></div>;

  return (
    <section className="space-y-6 pt-10">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Shop</p>
            <h1 className="mt-2 text-3xl font-bold">All Products</h1>
          </div>
          <FilterSidebar categories={categories} activeCategory={category} onChange={setCategory} />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
