import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomsByHotel,
  getRoomById,
  updateRoom,
  deleteRoom
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all rooms
router.get("/", getAllRooms);

// Get rooms by hotel
router.get("/hotel/:hotelId", getRoomsByHotel);

// Get room by ID
router.get("/:id", getRoomById);

// Create room (protected, hotel owner only)
router.post("/", protect, createRoom);

// Update room (protected, hotel owner only)
router.put("/:id", protect, updateRoom);

// Delete room (protected, hotel owner only)
router.delete("/:id", protect, deleteRoom);

export default router;
