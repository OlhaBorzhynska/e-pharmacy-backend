import { Schema, model, InferSchemaType } from "mongoose";

const locationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);

const storeSchema = new Schema(
  {
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
      required: true,
      min: 0,
      max: 5,
    },
    location: {
      type: locationSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

storeSchema.index({ location: "2dsphere" });

export type StoreType = InferSchemaType<typeof storeSchema>;

const Store = model("Store", storeSchema);

export default Store;
