import mongoose from "mongoose";

const Schema = mongoose.Schema;

// abstract class item schema
const itemSchema = {
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, required: true },
  storageLocation: { type: String, required: true },
  deliveryDate: { type: Date },
  expiryDate: { type: Date },
};

// schema for fresh items
const freshItemSchema = new Schema({
  ...itemSchema,
  type: { type: String, required: true, default: "fresh" },
  isOrganic: { type: Boolean, required: true },
});

// schema for dry items
const dryItemSchema = new Schema({
  ...itemSchema,
  type: { type: String, required: true, default: "dry" },
  packagingType: { type: String, required: true },
});

// schema for frozen items
const frozenItemSchema = new Schema({
  ...itemSchema,
  type: { type: String, required: true, default: "frozen" },
  minimumTemperature: { type: Number, required: true },
});

export const FreshItem = mongoose.model("FreshItem", freshItemSchema);
export const DryItem = mongoose.model("DryItem", dryItemSchema);
export const FrozenItem = mongoose.model("FrozenItem", frozenItemSchema);
