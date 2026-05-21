import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import iconsRoutes from "./routes/iconsRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "shopsphere-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/icons", iconsRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ShopSphere API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
