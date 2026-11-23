import { Schema, model, InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    testimonial: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type ReviewType = InferSchemaType<typeof reviewSchema>;

const Review = model("Review", reviewSchema);

export default Review;
