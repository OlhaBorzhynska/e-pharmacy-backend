import { Schema, model, InferSchemaType } from "mongoose";

const nearestPharmacySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["OPEN", "CLOSE"],
    required: true,
    default: "OPEN",
  },
});

export type NearestPharmacyType = InferSchemaType<typeof nearestPharmacySchema>;

const NearestPharmacy = model(
  "NearestPharmacy",
  nearestPharmacySchema,
  "nearestpharmacies",
);

export default NearestPharmacy;
