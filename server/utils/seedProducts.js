import Product from "../models/Product.js";

// Sample product seed data including `image`, `images` (array) and short `code`
// `code` is a two-letter brand/category code used by product cards (e.g. "Ba").
const products = [
  {
    title: "Nebula X Headphones",
    description: "Spatial audio headphones with metallic neon finish and adaptive noise isolation.",
    price: 249,
    image: "icon-headphones.svg",
    images: ["icon-headphones.svg"],
    code: "He",
    category: "Headphones",
    stock: 18,
  },
  {
    title: "Titan Edge Phone",
    description: "Dark titanium flagship phone with cinematic display and pro camera array.",
    price: 899,
    image: "icon-electronics.svg",
    images: ["icon-electronics.svg"],
    code: "El",
    category: "Electronics",
    stock: 11,
  },
  {
    title: "Pulse Time Watch",
    description: "Aero-grade smartwatch with AMOLED face, 10-day battery, and wellness suite.",
    price: 329,
    image: "icon-smartwatches.svg",
    images: ["icon-smartwatches.svg"],
    code: "Sw",
    category: "Smart Watches",
    stock: 9,
  },
  {
    title: "Luna Smartwatch",
    description: "Elegant smartwatch with customizable watch faces and health monitoring.",
    price: 279,
    image: "icon-smartwatches.svg",
    images: ["icon-smartwatches.svg"],
    code: "Sw",
    category: "Smart Watches",
    stock: 12,
  },
  {
    title: "Aether Carry Bag",
    description: "Structured premium commuter bag with water-resistant panels and smart pockets.",
    price: 189,
    image: "icon-bags-wallets.svg",
    images: ["icon-bags-wallets.svg"],
    code: "Ba",
    category: "Bags and Wallets",
    stock: 14,
  },
  {
    title: "Velocity Sneakers",
    description: "Lightweight performance sneakers with sculpted sole and futuristic upper.",
    price: 159,
    image: "icon-footwear.svg",
    images: ["icon-footwear.svg"],
    code: "Fo",
    category: "Footwear",
    stock: 23,
  },
  {
    title: "Noir Essence",
    description: "Bold evening fragrance with amber, saffron, cedar, and smoky musk.",
    price: 129,
    image: "icon-perfumes.svg",
    images: ["icon-perfumes.svg"],
    code: "Pe",
    category: "Perfumes",
    stock: 16,
  },
  {
    title: "Orbit Speaker",
    description: "360-degree wireless speaker with immersive bass and ambient light halo.",
    price: 219,
    image: "icon-electronics.svg",
    images: ["icon-electronics.svg"],
    code: "El",
    category: "Electronics",
    stock: 20,
  },
  {
    title: "Arc Wallet",
    description: "Slim RFID wallet crafted with soft-touch finish and magnetic closure.",
    price: 89,
    image: "icon-bags-wallets.svg",
    images: ["icon-bags-wallets.svg"],
    code: "Ba",
    category: "Bags and Wallets",
    stock: 28,
  },
  {
    title: "Stratus Earbuds",
    description: "True wireless earbuds with active noise cancellation and touch controls.",
    price: 149,
    image: "icon-headphones.svg",
    images: ["icon-headphones.svg"],
    code: "He",
    category: "Headphones",
    stock: 25,
  },
  {
    title: "Vortex Gaming Mouse",
    description: "Ergonomic gaming mouse with customizable RGB lighting and high-precision sensor.",
    price: 79,
    image: "icon-electronics.svg",
    images: ["icon-electronics.svg"],
    code: "El",
    category: "Electronics",
    stock: 30,
  },
  {
    title: "NOVA Perfume",
    description: "Fresh unisex fragrance with notes of bergamot, jasmine, and musk.",
    price: 99,
    image: "icon-perfumes.svg",
    images: ["icon-perfumes.svg"],
    code: "Pe",
    category: "Perfumes",
    stock: 22,
  },
  {
    title: "Portex Backpack",
    description: "Rugged backpack with modular compartments and weatherproof construction.",
    price: 199,
    image: "icon-bags-wallets.svg",
    images: ["icon-bags-wallets.svg"],
    code: "Ba",
    category: "Bags and Wallets",
    stock: 17,
  }
];

export async function seedProductsIfEmpty() {
  const existingTitles = new Set((await Product.find({}, "title")).map((product) => product.title));
  const missingProducts = products.filter((product) => !existingTitles.has(product.title));
  if (missingProducts.length) {
    // ensure we insert objects that match the schema — include `image` for compatibility
    await Product.insertMany(missingProducts);
  }
}
