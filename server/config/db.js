import mongoose from "mongoose";
import { seedProductsIfEmpty } from "../utils/seedProducts.js";

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(mongoUri);
  await seedProductsIfEmpty();
  console.log("MongoDB connected");
}
