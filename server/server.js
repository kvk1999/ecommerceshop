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
import adminRoutes from "./routes/adminRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(__dirname, "server/public/uploads");
const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS allowlist for local-network testing + production safety.
const allowedOrigins = (origin) => {
  // ✅ Crucial Fix: Mobile apps and Capacitor native bundles frequently pass no origin header
  if (!origin || origin === "null" || origin.startsWith("file://") || origin.startsWith("capacitor://")) {
    return true;
  }

  // Allow production via env
  const prodOrigin = process.env.CORS_ORIGIN;
  if (prodOrigin && origin === prodOrigin) return true;

  // Allow localhost and common LAN patterns for phone testing
  const lanRegex =
    /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3})(:[0-9]+)?$/;

  if (lanRegex.test(origin)) return true;

  // Fallback fallback rule for other deployment structures
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      try {
        if (allowedOrigins(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      } catch (err) {
        return callback(err);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/public", express.static(publicDir));
app.use("/public/uploads", express.static(uploadsDir));
app.use("/image", express.static(publicDir));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "shopsphere-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/icons", iconsRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ShopSphere API running securely on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });