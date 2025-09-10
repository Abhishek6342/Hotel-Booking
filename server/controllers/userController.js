import User from "../models/User.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, image },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add recent searched city
export const addRecentSearchedCity = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ success: false, message: "City is required" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Add city to the beginning and limit to 10
    user.recentSearchedCities = [city, ...user.recentSearchedCities.filter(c => c !== city)].slice(0, 10);
    await user.save();
    res.json({ success: true, recentSearchedCities: user.recentSearchedCities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
