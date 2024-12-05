import mongoose from "mongoose";

const Schema = mongoose.Schema;

// schema for order
const orderSchema = new Schema({
  orderDate: { type: Date, required: true },
  itemId: { type: mongoose.Types.ObjectId, required: true },
  itemType: { type: String, required: true },
  status: { type: Boolean, required: true, default: false },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  expectedDeliveryDate: { type: Date, required: true },
  expectedExpiryDate: { type: Date, required: true },
});

export default mongoose.model("Order", orderSchema);
