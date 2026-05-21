import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  addAddress,
  deleteAccount,
  deleteAddress,
  getAccount,
  setDefaultAddress,
  updateAddress,
  updatePassword,
  updateProfile,
  updateProfileImage,
} from "../controllers/accountController.js";

const router = Router();

router.use(requireAuth);

router.get("/me", getAccount);
router.patch("/", updateProfile);
router.patch("/password", updatePassword);

router.patch("/profile-image", updateProfileImage);

router.post("/addresses", addAddress);
router.patch("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);
router.patch("/addresses/:addressId/default", setDefaultAddress);

router.delete("/", deleteAccount);

export default router;

