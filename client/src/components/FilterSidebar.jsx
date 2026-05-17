export default function FilterSidebar({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            activeCategory === category
              ? "dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-200 light:border-cyan-500 light:bg-cyan-100 light:text-cyan-900"
              : "dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/35 light:border-slate-300 light:bg-slate-100 light:text-slate-700 light:hover:border-cyan-400/50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
