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

// Dynamic CORS safety layout for local network development + production deployment
const allowedOrigins = (origin) => {
  // ✅ CRITICAL FOR ANDROID: Allow both native app schemes and local https secure frames
  if (
    !origin || 
    origin === "null" || 
    origin.startsWith("file://") || 
    origin.startsWith("capacitor://") ||
    origin === "https://localhost" || 
    origin === "http://localhost"
  ) {
    return true;
  }

  // Allow your live Render web frontend links
  if (origin.includes("onrender.com")) {
    return true;
  }

  // Allow local machine routing
  const lanRegex =
    /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3})(:[0-9]+)?$/;

  if (lanRegex.test(origin)) return true;
  return false;
};

// ==========================================================================
// OPTIMIZED CORS FOR ANDROID NATIVE & WEB INTERACTION
// ==========================================================================
app.use(
  cors({
    origin: (origin, callback) => {
      try {
        if (allowedOrigins(origin)) return callback(null, true);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      } catch (err) {
        return callback(err);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json());
app.use("/public", express.static(publicDir));
app.use("/public/uploads", express.static(uploadsDir));
app.use("/image", express.static(publicDir));
app.use("/uploads", express.static(uploadsDir));

// Global health status check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "shopsphere-server" });
});

// ==========================================================================
// ✅ UPDATED HTTPS & LOCALHOST REWRITE MIDDLEWARE
// ==========================================================================
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    let jsonString = JSON.stringify(data);
    
    if (jsonString) {
      // 1. Fix old raw http links
      jsonString = jsonString.replaceAll(
        "http://ecommerceshop-hgbi.onrender.com", 
        "https://ecommerceshop-hgbi.onrender.com"
      );
      
      // 2. Fix stray localhost links so they point to your live cloud server instead
      jsonString = jsonString.replaceAll(
        "http://localhost:5000", 
        "https://ecommerceshop-hgbi.onrender.com"
      );
      
      return originalJson.call(this, JSON.parse(jsonString));
    }
    return originalJson.call(this, data);
  };
  next();
});

// ==========================================================================
// APPLICATION API ROUTE INSTANCES
// ==========================================================================
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
      console.log(`ShopSphere API active on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });