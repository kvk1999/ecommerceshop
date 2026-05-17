import User from "../models/User.js";
import Product from "../models/Product.js";

export async function getWishlist(req, res) {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
}

export async function addToWishlist(req, res) {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  const exists = user.wishlist.some((id) => id.toString() === productId);
  if (!exists) {
    user.wishlist.unshift(product._id);
    await user.save();
  }

  const hydrated = await User.findById(req.user._id).populate("wishlist");
  res.status(201).json(hydrated.wishlist);
}

export async function removeFromWishlist(req, res) {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.id);
  await user.save();
  const hydrated = await User.findById(req.user._id).populate("wishlist");
  res.json(hydrated.wishlist);
}
