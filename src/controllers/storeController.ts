import type { Request, Response } from "express";
import Store from "../models/Store";

export const getStores = async (_req: Request, res: Response) => {
  try {
    const stores = await Store.find();

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
