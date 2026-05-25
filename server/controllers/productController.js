import Product from "../models/Product.js";

const IMAGE_ALIASES = {
  headphones: "icon-headphones.svg",
  headset: "icon-headphones.svg",
  earbud: "icon-headphones.svg",
  earbuds: "icon-headphones.svg",
  speaker: "icon-electronics.svg",
  phone: "icon-electronics.svg",
  mobile: "icon-electronics.svg",
  electronics: "icon-electronics.svg",
  electronic: "icon-electronics.svg",
  device: "icon-electronics.svg",
  watch: "icon-smartwatches.svg",
  smartwatch: "icon-smartwatches.svg",
  "smart watch": "icon-smartwatches.svg",
  smartwatches: "icon-smartwatches.svg",
  bag: "icon-bags-wallets.svg",
  bags: "icon-bags-wallets.svg",
  wallet: "icon-bags-wallets.svg",
  wallets: "icon-bags-wallets.svg",
  footwear: "icon-footwear.svg",
  shoe: "icon-footwear.svg",
  shoes: "icon-footwear.svg",
  perfume: "icon-perfumes.svg",
  perfumes: "icon-perfumes.svg",
};

function getPublicBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}/public`;
}

function normalizeAssetPath(value) {
  if (!value || typeof value !== "string") {
    return value;
  }

  const cleaned = value.trim().replace(/^\.?\//, "");

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  if (cleaned.startsWith("public/")) {
    return cleaned.slice("public/".length);
  }

  if (cleaned.startsWith("image/")) {
    return cleaned.slice("image/".length);
  }

  if (cleaned.startsWith("images/")) {
    return cleaned.slice("images/".length);
  }

  return cleaned;
}

function resolveAssetFile(value) {
  const normalized = normalizeAssetPath(value);
  if (!normalized) {
    return normalized;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  const cleaned = normalized.toLowerCase();
  if (cleaned.endsWith(".svg")) {
    return normalized.replace(/^\/+/, "");
  }

  return IMAGE_ALIASES[cleaned] || IMAGE_ALIASES[cleaned.replace(/^icon-/, "")] || `${normalized.replace(/^\/+/, "")}.svg`;
}

function toPublicUrl(req, value) {
  const resolved = resolveAssetFile(value);
  if (!resolved) {
    return resolved;
  }

  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }

  return `${getPublicBaseUrl(req)}/${resolved}`;
}

function serializeProduct(req, product) {
  const plain = product.toJSON ? product.toJSON() : product;
  const images = Array.isArray(plain.images)
    ? plain.images.map((asset) => toPublicUrl(req, asset))
    : [];

  return {
    ...plain,
    image: toPublicUrl(req, plain.image) || plain.image,
    images,
  };
}

export async function getProducts(req, res) {
  const search = req.query.search || "";
  const category = req.query.category || "All";
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (category !== "All") {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products.map((product) => serializeProduct(req, product)));
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(serializeProduct(req, product));
}

export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(serializeProduct(req, product));
}

export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(serializeProduct(req, product));
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(204).send();
}
