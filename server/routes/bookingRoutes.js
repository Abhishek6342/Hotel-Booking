import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getHotelBookings
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's bookings
router.get("/my-bookings", protect, getUserBookings);

// Create booking
router.post("/", protect, createBooking);

// Get booking by ID
router.get("/:id", protect, getBookingById);

// Update booking (e.g., special requests)
router.put("/:id", protect, updateBooking);

// Cancel booking
router.patch("/:id/cancel", protect, cancelBooking);

// Get bookings for a hotel (hotel owner only)
router.get("/hotel/:hotelId", protect, getHotelBookings);

export default router;
