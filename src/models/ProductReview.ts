import { Schema, model, InferSchemaType } from "mongoose";

const productReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    testimonial: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

productReviewSchema.index({ product: 1, createdAt: -1 });

export type ProductReviewType = InferSchemaType<typeof productReviewSchema>;

const ProductReview = model("ProductReview", productReviewSchema);

export default ProductReview;
