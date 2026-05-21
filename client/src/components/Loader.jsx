export default function Loader({ label = "Loading..." }) {
  return (
    <div className="glass-card min-h-[220px] p-6">
      <div className="flex flex-col items-center justify-center gap-6 rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-950/50">
        <div className="mx-auto h-12 w-12 rounded-full border-2 border-cyan-300/25 border-t-cyan-400 animate-spin" />
        <div className="space-y-4">
          <div className="mx-auto h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mx-auto h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
