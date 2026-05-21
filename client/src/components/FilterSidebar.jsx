export default function FilterSidebar({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
            activeCategory === category
              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-700 shadow-glow dark:border-cyan-400/30 dark:bg-cyan-500/10 dark:text-cyan-200"
              : "border-white/10 bg-white/5 text-slate-600 hover:border-cyan-400/40 hover:bg-white/20 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:bg-slate-900/60"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
