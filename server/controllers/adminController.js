import User from "../models/User.js";
import Order from "../models/Order.js";

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  };
}

export async function listUsersWithOrderHistory(req, res) {
  // Admin only
  const users = await User.find({}).sort({ createdAt: -1 });

  // NOTE: we include only order meta/totals + status.
  // Items line details are not returned per requirement.
  const userIds = users.map((u) => u._id);
  const orders = await Order.find({ userId: { $in: userIds } }).sort({ createdAt: -1 });

  const byUser = new Map();
  for (const u of users) byUser.set(u._id.toString(), []);
  for (const o of orders) {
    const arr = byUser.get(o.userId.toString());
    if (!arr) continue;

    arr.push({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,
      total: o.total,
      discountPercent: o.discountPercent,
      discountAmount: o.discountAmount,
      cancellationReason: o.cancellationReason,
      items: (o.items || []).map((it) => ({
        productId: it.productId,
        title: it.title,
        quantity: it.quantity,
        lineTotal: it.lineTotal,
      })),
    });
  }

  res.json(
    users.map((u) => ({
      user: sanitizeUser(u),
      orders: byUser.get(u._id.toString()) || [],
    }))
  );
}

export async function promoteToAdmin(req, res) {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = "admin";
  await user.save();

  res.json({ user: sanitizeUser(user) });
}

