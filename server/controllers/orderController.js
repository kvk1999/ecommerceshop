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

export async function cancelOrder(req, res) {
  const { orderId } = req.params;
  const { cancellationReason } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only cancel your own orders" });
  }

  if (order.status !== "Placed") {
    return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
  }

  order.status = "Cancelled";
  order.cancellationReason = cancellationReason;
  await order.save();

  res.json(order);
}
