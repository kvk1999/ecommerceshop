import { Router } from "express";
import { listUsersWithOrderHistory, promoteToAdmin } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsersWithOrderHistory);
router.post("/users/:id/promote", promoteToAdmin);

export default router;

