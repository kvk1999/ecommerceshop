import Product from "../models/Product.js";

const products = [
  { title: "Nebula X Headphones", description: "Spatial audio headphones with metallic neon finish and adaptive noise isolation.", price: 249, image: "headphones", category: "Headphones", stock: 18 },
  { title: "Titan Edge Phone", description: "Dark titanium flagship phone with cinematic display and pro camera array.", price: 899, image: "phone", category: "Electronics", stock: 11 },
  { title: "Pulse Time Watch", description: "Aero-grade smartwatch with AMOLED face, 10-day battery, and wellness suite.", price: 329, image: "watch", category: "Smart Watches", stock: 9 },
  { title: "Luna Smartwatch", description: "Elegant smartwatch with customizable watch faces and health monitoring.", price: 279, image: "watch", category: "Smart Watches", stock: 12 },
  { title: "Aether Carry Bag", description: "Structured premium commuter bag with water-resistant panels and smart pockets.", price: 189, image: "bag", category: "Bags and Wallets", stock: 14 },
  { title: "Velocity Sneakers", description: "Lightweight performance sneakers with sculpted sole and futuristic upper.", price: 159, image: "shoe", category: "Footwear", stock: 23 },
  { title: "Noir Essence", description: "Bold evening fragrance with amber, saffron, cedar, and smoky musk.", price: 129, image: "perfume", category: "Perfumes", stock: 16 },
  { title: "Orbit Speaker", description: "360-degree wireless speaker with immersive bass and ambient light halo.", price: 219, image: "speaker", category: "Electronics", stock: 20 },
  { title: "Arc Wallet", description: "Slim RFID wallet crafted with soft-touch finish and magnetic closure.", price: 89, image: "wallet", category: "Bags and Wallets", stock: 28 },
  { title: "Stratus Earbuds", description: "True wireless earbuds with active noise cancellation and touch controls.", price: 149, image: "headphones", category: "Headphones", stock: 25 },
];

export async function seedProductsIfEmpty() {
  const existingTitles = new Set((await Product.find({}, "title")).map((product) => product.title));
  const missingProducts = products.filter((product) => !existingTitles.has(product.title));
  if (missingProducts.length) {
    await Product.insertMany(missingProducts);
  }
}
