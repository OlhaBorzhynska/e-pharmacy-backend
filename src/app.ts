import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customer-reviews", reviewRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "E-Pharmacy API is running",
  });
});

export default app;
