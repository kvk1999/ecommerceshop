import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <label className="flex w-full min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-800 shadow-sm shadow-slate-900/5 transition duration-300 focus-within:border-cyan-400/40 focus-within:bg-white/20 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-100 light:border-slate-300 light:bg-slate-100 light:text-slate-900">
      <Search className="h-4 w-4 shrink-0 text-slate-500" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products, categories, or brands"
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500"
      />
      <span className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300 sm:inline-flex">
        CTRL + K
      </span>
    </label>
  );
}
