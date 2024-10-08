import dotenv from "dotenv";
dotenv.config();
import { createServer } from "./infrastructure/config/app";
import { connectDB } from "./infrastructure/config/db";
import socketServer from "./infrastructure/config/socket";

const PORT = process.env.PORT || 3000;
const startServer = async (): Promise<void> => {
  await connectDB();
  const app: any = createServer();
  if (app) socketServer(app);
  app?.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
//fixing