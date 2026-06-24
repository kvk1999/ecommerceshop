import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { productImageUpload } from "../middleware/uploadImageMiddleware.js";


const router = Router();

router.get("/", getProducts);
router.get("", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  productImageUpload.array("images", 6),
  createProduct
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  productImageUpload.array("images", 6),
  updateProduct
);

router.delete("/:id", requireAuth, requireAdmin, deleteProduct);


export default router;

