import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  user: { type: String, required: true, ref: "User" },
  room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Room" },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
  specialRequests: { type: String },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
