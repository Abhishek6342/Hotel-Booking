import express from "express";
import { getUserProfile, updateUserProfile, addRecentSearchedCity } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update user profile
router.put("/profile", protect, updateUserProfile);

// Add recent searched city
router.post("/add-city", protect, addRecentSearchedCity);

export default router;
