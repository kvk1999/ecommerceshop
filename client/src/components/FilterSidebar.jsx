export default function FilterSidebar({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            activeCategory === category
              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
              : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/35"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
