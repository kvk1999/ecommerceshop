import Order from "../models/Order.js";
import User from "../models/User.js";

export async function getOrders(req, res) {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function createOrder(req, res) {
  const order = await Order.create({
    userId: req.user._id,
    customer: req.body.customer,
    items: req.body.items,
    total: req.body.total,
    status: "Placed",
  });

  await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
  res.status(201).json(order);
}
