import express from "express";
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getHotelsByOwner
} from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all hotels
router.get("/", getAllHotels);

// Get hotel by ID
router.get("/:id", getHotelById);

// Create hotel (protected, hotel owner only)
router.post("/", protect, createHotel);

// Update hotel (protected, owner only)
router.put("/:id", protect, updateHotel);

// Delete hotel (protected, owner only)
router.delete("/:id", protect, deleteHotel);

// Get hotels by owner (protected)
router.get("/owner/my-hotels", protect, getHotelsByOwner);

export default router;
