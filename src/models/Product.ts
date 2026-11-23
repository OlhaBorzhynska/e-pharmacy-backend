import { Schema, model, InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
    },
    suppliers: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
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
  {
    timestamps: true,
  },
);

export type ProductType = InferSchemaType<typeof productSchema>;

const Product = model("Product", productSchema);

export default Product;
