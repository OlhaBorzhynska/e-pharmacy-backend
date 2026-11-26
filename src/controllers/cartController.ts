import Cart from "../models/Cart";
import type { AuthRequest } from "../middlewares/authMiddleware";
import type { Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import Order from "../models/Order";
import { checkoutSchema } from "../validations/checkoutValidation";

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name photo price",
    );

    res.status(200).json({
      status: "success",
      data: {
        cart: cart || {
          items: [],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching cart",
    });
  }
};

export const updateCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({
        status: "error",
        message: "Items must be an array",
      });
      return;
    }

    const isValidItems = items.every(
      (item) =>
        item &&
        typeof item.product === "string" &&
        mongoose.Types.ObjectId.isValid(item.product) &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1,
    );

    if (!isValidItems) {
      res.status(400).json({
        status: "error",
        message: "Each item must have a valid product ID and quantity",
      });
      return;
    }

    const productIds = items.map((item) => item.product);
    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      res.status(400).json({
        status: "error",
        message: "Duplicate products are not allowed",
      });
      return;
    }

    const products = await Product.find({
      _id: { $in: productIds },
    }).select("_id");

    if (products.length !== productIds.length) {
      res.status(404).json({
        status: "error",
        message: "One or more products were not found",
      });
      return;
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items } },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    ).populate("items.product", "name photo price");

    res.status(200).json({
      status: "success",
      message: "Cart updated successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error("Error updating cart:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while updating cart",
    });
  }
};

export const checkoutCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    const { error, value } = checkoutSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      res.status(400).json({
        status: "error",
        message: "Invalid checkout data",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name photo price",
    );

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        status: "error",
        message: "Your cart is empty",
      });
      return;
    }

    const orderItems = cart.items.map((item) => {
      const product = item.product as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        photo: string;
        price: number;
      };

      return {
        product: product._id,
        name: product.name,
        photo: product.photo,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: userId,
      ...value,
      items: orderItems,
      totalPrice,
    });

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while placing your order",
    });
  }
};
