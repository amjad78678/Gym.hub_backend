import { createServer } from "./infrastructure/config/app";
import { connectDB } from "./infrastructure/config/db";
import dotenv from "dotenv";
import socketServer from "./infrastructure/config/socket";
const firebase = require("firebase-admin");
const serviceAccount = require("../src/infrastructure/services/gymhub-push-notification-firebase-adminsdk-34ryj-4eaaeb8cda.json");
dotenv.config();
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});
const PORT = process.env.PORT || 3000;
const startServer = async (): Promise<void> => {
  await connectDB();
  const app: any = createServer();
  if (app) socketServer(app);
  app?.listen(PORT, () => {
    console.log(`Server is running on port https://127.0.0.1/${PORT}`);
  });
};

startServer();
export default firebase;
