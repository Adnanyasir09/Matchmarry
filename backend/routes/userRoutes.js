import express from "express";
import {
  updateProfile,
  getUserProfile,
  getMatchingUsers,
   getPublicUserProfile, // ✅ NEW
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getUserProfile);
router.put("/me", authMiddleware, updateProfile);
router.get("/matches", authMiddleware, getMatchingUsers);
router.get("/:id", authMiddleware, getPublicUserProfile);

export default router;
