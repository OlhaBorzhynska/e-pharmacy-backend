import { Schema, model, InferSchemaType } from "mongoose";

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
    status: {
      type: String,
      enum: ["OPEN", "CLOSE"],
      required: true,
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  },
);

export type StoreType = InferSchemaType<typeof storeSchema>;

const Store = model("Store", storeSchema);

export default Store;
