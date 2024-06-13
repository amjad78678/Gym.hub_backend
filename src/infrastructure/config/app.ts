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


export const createServer = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
        optionsSuccessStatus: 200
      })
    );
    app.use(cookieParser());
    app.use(morgan("tiny"));

    const httpServer = http.createServer(app);

    app.use("/api/user", userRoutes);
    app.use("/api/gym", gymRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/trainer", trainerRoutes);
    app.use("/api/payment", paymentRoutes );

    app.use((req, res) =>
      res.status(404).json({ success: false, message: "Not Found" })
    );

    return httpServer;
  } catch (error) {
    const err: Error = error as Error;
    console.log(err.message);
  }
};
