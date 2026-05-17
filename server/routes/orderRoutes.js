import { Router } from "express";
import { createOrder, getOrders, cancelOrder } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:orderId/cancel", cancelOrder);

export default router;
