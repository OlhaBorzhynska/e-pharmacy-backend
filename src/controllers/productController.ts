import type { Request, Response } from "express";
import Product from "../models/Product";
import mongoose from "mongoose";
import ProductReview from "../models/ProductReview";

const PRODUCT_CATEGORIES = [
  "Medicine",
  "Heart",
  "Head",
  "Hand",
  "Leg",
  "Dental Care",
  "Skin Care",
];

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 12;

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { name, category } = req.query;

    if (name !== undefined && typeof name !== "string") {
      res.status(400).json({
        status: "error",
        message: "The name parameter must be a string",
      });
      return;
    }

    if (category !== undefined && typeof category !== "string") {
      res.status(400).json({
        status: "error",
        message: "The category parameter must be a string",
      });
      return;
    }

    if (category && !PRODUCT_CATEGORIES.includes(category)) {
      res.status(400).json({
        status: "error",
        message: "Invalid product category",
      });
      return;
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? DEFAULT_LIMIT);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      res.status(400).json({
        status: "error",
        message: "Page and limit must be positive integers",
      });
      return;
    }

    const safeLimit = Math.min(limit, MAX_LIMIT);

    const filter: Record<string, unknown> = {};

    if (name?.trim()) {
      const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.name = {
        $regex: escapedName,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / safeLimit);
    const skip = (page - 1) * safeLimit;

    const products = await Product.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(safeLimit);

    res.status(200).json({
      status: "success",
      results: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid product ID",
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }

    const reviewStats = await ProductReview.aggregate([
      {
        $match: {
          product: product._id,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ["$averageRating", 1] },
          totalReviews: 1,
        },
      },
    ]);

    const { averageRating = 0, totalReviews = 0 } = reviewStats[0] || {};

    res.status(200).json({
      status: "success",
      data: {
        product,
        averageRating,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the product",
    });
  }
};
