import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import OrderCard from "../components/OrderCard";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { loggedIn } = useAuth();
  const { orders, loading } = useCart();

  if (loading) return <div className="pt-10"><Loader label="Loading orders..." /></div>;
  if (!loggedIn) {
    return (
      <section className="space-y-6 pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Please log in to view order history.</p>
          <p className="mt-2 text-slate-400">Orders are now attached to authenticated users.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 pt-10">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="mt-2 text-slate-400">Track every order placed from this session.</p>
      </div>
      {orders.length ? (
        <div className="space-y-4">
          {[...orders].reverse().map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">No orders yet.</p>
          <p className="mt-2 text-slate-400">Placed orders will appear here with their shipping details.</p>
        </div>
      )}
    </section>
  );
}
