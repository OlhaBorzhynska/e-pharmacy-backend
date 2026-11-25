import type { Request, Response } from "express";
import Store from "../models/Store";
import NearestPharmacy from "../models/NearestPharmacy";

export const getStores = async (req: Request, res: Response) => {
  try {
    const rawLimit = req.query.limit;

    if (rawLimit !== undefined && typeof rawLimit !== "string") {
      res.status(400).json({
        status: "error",
        message: "Limit must be a single integer value",
      });
      return;
    }

    const limit = rawLimit === undefined ? 6 : Number(rawLimit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      res.status(400).json({
        status: "error",
        message: "Limit must be an integer between 1 and 20",
      });
      return;
    }

    const stores = await Store.find().limit(limit);

    res.status(200).json({
      status: "success",
      results: stores.length,
      data: {
        stores,
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching stores",
    });
  }
};

export const getNearestStores = async (req: Request, res: Response) => {
  try {
    const rawLimit = req.query.limit;

    if (rawLimit !== undefined && typeof rawLimit !== "string") {
      res.status(400).json({
        status: "error",
        message: "Limit must be a single integer value",
      });
      return;
    }

    const limit = rawLimit === undefined ? 6 : Number(rawLimit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 9) {
      res.status(400).json({
        status: "error",
        message: "Limit must be an integer between 1 and 9",
      });
      return;
    }

    const stores = await NearestPharmacy.find().limit(limit);

    res.status(200).json({
      status: "success",
      results: stores.length,
      data: {
        stores,
      },
    });
  } catch (error) {
    console.error("Error getting nearest pharmacies:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while getting nearest pharmacies",
    });
  }
};
