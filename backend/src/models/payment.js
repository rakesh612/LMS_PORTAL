import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
