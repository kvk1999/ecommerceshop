import { Router } from "express";
import { addToCart, getCart, removeFromCart, replaceCart } from "../controllers/cartController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/", replaceCart);
router.delete("/:id", removeFromCart);

export default router;
