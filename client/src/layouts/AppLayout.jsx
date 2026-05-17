import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppLayout() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute right-[-6%] top-10 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/10 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Navbar search={search} setSearch={setSearch} />
        <Outlet context={{ search }} />
        <Footer />
      </main>
    </div>
  );
}
