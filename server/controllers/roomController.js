import Room from "../models/Room.js";

// Create a new room (only hotel owners)
export const createRoom = async (req, res) => {
  try {
    if (req.user.role !== "hotelOwner") {
      return res.status(403).json({ success: false, message: "Only hotel owners can create rooms" });
    }
    const { hotel, roomNumber, type, price, amenities, maxGuests, availability, description, images } = req.body;
    if (!hotel || !roomNumber || !type || !price) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const room = new Room({
      hotel,
      roomNumber,
      type,
      price,
      amenities,
      maxGuests,
      availability,
      description,
      images,
    });
    await room.save();
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all rooms (optionally filter by hotel)
export const getAllRooms = async (req, res) => {
  try {
    const { hotel } = req.query;
    const filter = hotel ? { hotel } : {};
    const rooms = await Room.find(filter).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get rooms by hotel
export const getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel");
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update room (only hotel owner)
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    // Check if user owns the hotel of this room
    if (req.user.role !== "hotelOwner") {
      return res.status(403).json({ success: false, message: "Only hotel owners can update rooms" });
    }
    // Optionally, verify ownership by comparing room.hotel.owner with req.user._id if needed
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete room (only hotel owner)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    if (req.user.role !== "hotelOwner") {
      return res.status(403).json({ success: false, message: "Only hotel owners can delete rooms" });
    }
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
