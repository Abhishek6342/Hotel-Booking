import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests, specialRequests } = req.body;
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    // Calculate total price (simple calculation: price per night * number of nights)
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = roomData.price * nights;

    const booking = new Booking({
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      specialRequests,
    });
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("room").populate("user");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room").populate("user");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only view your own bookings" });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking (limited fields)
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only update your own bookings" });
    }
    const { specialRequests } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { specialRequests },
      { new: true }
    );
    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only cancel your own bookings" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings for a hotel (for hotel owners)
export const getHotelBookings = async (req, res) => {
  try {
    if (req.user.role !== "hotelOwner") {
      return res.status(403).json({ success: false, message: "Only hotel owners can view hotel bookings" });
    }
    // Find rooms owned by the hotel owner, then find bookings for those rooms
    const rooms = await Room.find({ hotel: req.params.hotelId });
    const roomIds = rooms.map(room => room._id);
    const bookings = await Booking.find({ room: { $in: roomIds } }).populate("room").populate("user");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
