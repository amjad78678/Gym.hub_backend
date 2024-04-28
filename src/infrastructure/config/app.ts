import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import http from "http";
import path from "path";
import morgan from "morgan"

//Routes root
import userRoutes from "../routes/userRoutes";
import gymRoutes from '../routes/gymRoutes'
import adminRoutes from '../routes/adminRoutes';
import trainerRoutes from '../routes/trainerRoutes';

const app = express();
const httpServer = http.createServer(app);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);



app.use("/api/user", userRoutes);
app.use("/api/gym",gymRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/trainer", trainerRoutes)



export {httpServer}

