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
    <label className="flex w-full min-w-0 items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 transition focus-within:border-cyan-400/40 focus-within:bg-slate-950/80">
      <Search className="h-4 w-4 shrink-0 text-slate-500" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for products, categories or tags"
        className="min-w-0 flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
      />
      <span className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold tracking-[0.2em] text-slate-300 sm:inline-flex">
        CTRL K
      </span>
    </label>
  );
}
