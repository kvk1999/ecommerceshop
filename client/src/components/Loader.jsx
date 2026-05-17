export default function Loader({ label = "Loading..." }) {
  return (
    <div className="glass-card flex min-h-[220px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
        <p className="mt-4 text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}
