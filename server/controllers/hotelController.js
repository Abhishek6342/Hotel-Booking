import Hotel from "../models/Hotel.js";

// Create a new hotel (only for hotel owners)
export const createHotel = async (req, res) => {
  try {
    if (req.user.role !== "hotelOwner") {
      return res.status(403).json({ success: false, message: "Only hotel owners can create hotels" });
    }
    const { name, address, contact, city } = req.body;
    if (!name || !address || !contact || !city) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const hotel = new Hotel({
      name,
      address,
      contact,
      owner: req.user._id,
      city,
    });
    await hotel.save();
    res.status(201).json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all hotels with optional city filter
export const getAllHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city } : {};
    const hotels = await Hotel.find(filter).populate("owner", "username email");
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("owner", "username email");
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update hotel (only by owner)
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only update your own hotels" });
    }
    const { name, address, contact, city } = req.body;
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { name, address, contact, city },
      { new: true }
    );
    res.json({ success: true, hotel: updatedHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete hotel (only by owner)
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own hotels" });
    }
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get hotels by owner
export const getHotelsByOwner = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id });
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
