import { Schema, model, InferSchemaType } from "mongoose";

const descriptionSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const descriptionBlockSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
    },
    sections: {
      type: [descriptionSectionSchema],
      default: [],
    },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, required: true },
    brand: { type: String, trim: true },
    description: {
      type: [descriptionBlockSchema],
      default: [],
    },
    suppliers: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Medicine",
        "Heart",
        "Head",
        "Hand",
        "Leg",
        "Dental Care",
        "Skin Care",
      ],
    },
  },
  { timestamps: true },
);

export type ProductType = InferSchemaType<typeof productSchema>;

const Product = model("Product", productSchema);

export default Product;
