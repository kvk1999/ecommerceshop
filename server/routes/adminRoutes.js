import { Router } from "express";
import {
  listUsersWithOrderHistory,
  promoteToAdmin,
  toggleUserRole,
  onboardUser,
} from "../controllers/adminController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsersWithOrderHistory);
router.post("/users/:id/promote", promoteToAdmin);

// PATCH /api/admin/users/:id/toggle-role
// Switch role between customer <-> admin
router.patch("/users/:id/toggle-role", toggleUserRole);

// POST /api/admin/users/onboard
router.post("/users/onboard", onboardUser);

export default router;



