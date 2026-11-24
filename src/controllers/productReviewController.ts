import type { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import ProductReview from "../models/ProductReview";

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = "1", limit = "3" } = req.query;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid product ID",
      });
      return;
    }

    if (
      typeof page !== "string" ||
      typeof limit !== "string" ||
      !/^\d+$/.test(page) ||
      !/^\d+$/.test(limit) ||
      Number(page) < 1 ||
      Number(limit) < 1 ||
      Number(limit) > 50
    ) {
      res.status(400).json({
        status: "error",
        message: "Invalid pagination parameters",
      });
      return;
    }

    const product = await Product.exists({ _id: id });

    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const [reviews, totalReviews] = await Promise.all([
      ProductReview.find({ product: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      ProductReview.countDocuments({ product: id }),
    ]);

    res.status(200).json({
      status: "success",
      results: reviews.length,
      totalReviews,
      totalPages: Math.ceil(totalReviews / perPage),
      currentPage,
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching product reviews",
    });
  }
};
