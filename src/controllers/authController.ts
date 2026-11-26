import type { Request, Response } from "express";
import User from "../models/User";
import { registerSchema } from "../validations/authValidation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validations/authValidation";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const { name, email, phone, password } = value;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    const token = jwt.sign({ userId: user._id.toString() }, secret, {
      expiresIn: "1d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
      return;
    }

    console.error("Error registering user:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while registering the user",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const { email, password } = value;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({ userId: user._id.toString() }, secret, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in",
    });
  }
};

export const getUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        status: "error",
        message: "User is not authenticated",
      });
      return;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user info:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while getting user information",
    });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};
