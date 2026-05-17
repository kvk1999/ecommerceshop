import User from "../models/User.js";
import Product from "../models/Product.js";

function mapCart(user) {
  return user.cart
    .filter((item) => item.productId)
    .map((item) => ({
      productId: item.productId._id ? item.productId._id.toString() : item.productId.toString(),
      quantity: item.quantity,
      product: item.productId._id ? item.productId : undefined,
    }));
}

export async function getCart(req, res) {
  const user = await User.findById(req.user._id).populate("cart.productId");
  res.json(mapCart(user));
}

export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((item) => item.productId.toString() === productId);
  if (existing) existing.quantity += quantity;
  else user.cart.push({ productId, quantity });
  await user.save();

  const hydrated = await User.findById(req.user._id).populate("cart.productId");
  res.status(201).json(mapCart(hydrated));
}

export async function removeFromCart(req, res) {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item.productId.toString() !== req.params.id);
  await user.save();
  const hydrated = await User.findById(req.user._id).populate("cart.productId");
  res.json(mapCart(hydrated));
}

export async function replaceCart(req, res) {
  const user = await User.findById(req.user._id);
  user.cart = (req.body.items || []).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
  await user.save();
  const hydrated = await User.findById(req.user._id).populate("cart.productId");
  res.json(mapCart(hydrated));
}
