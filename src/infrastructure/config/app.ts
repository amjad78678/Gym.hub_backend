import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import morgan from "morgan";
//Routes root
import userRoutes from "../routes/userRoutes";
import gymRoutes from "../routes/gymRoutes";
import adminRoutes from "../routes/adminRoutes";
import trainerRoutes from "../routes/trainerRoutes";
import paymentRoutes from "../routes/paymentRoutes";
import { AppError, globalErrorHandler } from "../utils/globalErrorHandler";

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ extended: true, limit: "100mb" }));
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(morgan("tiny"));
    const httpServer = http.createServer(app);

    app.use("/api/user", userRoutes);
    app.use("/api/gym", gymRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/trainer", trainerRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("*", (req, res, next) => {
      const err = new AppError(
        `Can't find ${req.originalUrl} on the server`,
        404
      );
      next(err);
    });
    app.use(globalErrorHandler);

    return httpServer;
  } catch (error) {
    const err: Error = error as Error;
  }
};
