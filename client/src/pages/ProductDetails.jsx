import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/http";
import Loader from "../components/Loader";
import { currency } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { normalizePublicPath, getImageCandidates } from "../utils/image";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainIndex, setMainIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const mainCandidates = getImageCandidates((product?.images && product.images[mainIndex]) || product?.image);

  const handleImgError = (e) => {
    const el = e.currentTarget;
    const list = el.dataset.candidates ? JSON.parse(el.dataset.candidates) : mainCandidates;
    let idx = parseInt(el.dataset.candidateIndex || "0", 10);
    idx++;
    el.dataset.candidateIndex = idx;
    if (list && list[idx]) el.src = list[idx];
    else el.src = "/icon-placeholder.svg";
  };

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-10"><Loader label="Loading product..." /></div>;
  if (!product) return <div className="pt-10 text-slate-400">Product not found.</div>;

  return (
    <section className="pt-10">
      <div className="glass-card grid gap-8 p-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[1.5rem] bg-gradient-to-br from-cyan-400/10 via-slate-900/50 to-violet-500/10 p-6">
          <div className="w-full rounded-xl bg-white/5 overflow-hidden">
            <button onClick={() => setPreviewOpen(true)} className="w-full">
              <img
                src={mainCandidates[0]}
                data-candidates={JSON.stringify(mainCandidates)}
                data-candidate-index={0}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="w-full h-72 object-cover"
                onError={handleImgError}
              />
            </button>
          </div>
          <div className="flex gap-3">
            {(product.images || []).map((img, idx) => {
              const thumbCandidates = getImageCandidates(img);
              return (
                <button key={img + idx} onClick={() => setMainIndex(idx)} className={`rounded-lg overflow-hidden ring-2 ${mainIndex === idx ? "ring-cyan-400" : "ring-transparent"}`}>
                  <img src={thumbCandidates[0]} data-candidates={JSON.stringify(thumbCandidates)} data-candidate-index={0} alt={`thumb-${idx}`} loading="lazy" decoding="async" className="h-14 w-14 object-cover" onError={handleImgError} />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{product.category}</p>
          <h1 className="mt-3 text-4xl font-bold">{product.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{product.description}</p>
          <div className="mt-6 text-3xl font-bold">{currency(product.price)}</div>
          <p className="mt-2 text-sm text-slate-400">{product.stock} units in stock</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => addToCart(product.id)} className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow">
              Add To Cart
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold">
              {wishlistIds.includes(product.id) ? "Remove Wishlist" : "Add Wishlist"}
            </button>
            <Link to="/products" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="relative max-w-3xl w-full">
            <button onClick={() => setPreviewOpen(false)} className="absolute right-2 top-2 rounded-full bg-white/10 px-3 py-1">Close</button>
            <div className="rounded-lg overflow-hidden bg-white/5 p-4">
              <img src={mainCandidates[0]} data-candidates={JSON.stringify(mainCandidates)} data-candidate-index={0} alt={product.title} loading="lazy" decoding="async" className="w-full h-[520px] object-cover" onError={handleImgError} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
