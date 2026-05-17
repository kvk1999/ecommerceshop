import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loggedIn, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  if (loggedIn) {
    return (
      <section className="pt-10">
        <div className="glass-card mx-auto max-w-xl p-10 text-center">
          <h1 className="text-3xl font-bold">You are logged in</h1>
          <p className="mt-3 text-slate-400">{user?.email}</p>
        </div>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await login(form.email, form.password);
    navigate("/");
  }

  return (
    <section className="pt-10">
      <div className="glass-card mx-auto max-w-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Login</h1>
          <Link to="/register" className="text-sm text-cyan-300">
            Need an account?
          </Link>
        </div>
        <p className="mt-3 text-slate-400">Use the new JWT-based authentication flow to access wishlist, cart, checkout, and orders.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
          />
          <input
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
          />
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-glow">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
