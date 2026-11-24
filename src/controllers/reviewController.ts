import type { Request, Response } from "express";
import Review from "../models/Review";

export const getCustomerReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching customer reviews:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching customer reviews",
    });
  }
};
