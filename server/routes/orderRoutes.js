import { Router } from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getOrders);
router.post("/", createOrder);

export default router;
