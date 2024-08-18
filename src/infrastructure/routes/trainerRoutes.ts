import express from "express";
import TrainerController from "../../adapters/controllers/trainerController";
import TrainerUseCase from "../../useCase/trainerUseCase";
import TrainerRepository from "../repository/trainerRepository";
import EncryptPassword from "../services/bcryptPassword";
import JWTToken from "../services/generateToken";
import GenerateOtp from "../services/generateOtp";
import GenerateEmail from "../services/sendEmail";
import { protect } from "../middleware/trainerAuth";
import MessageController from "../../adapters/controllers/messageController";
import MessageUseCase from "../../useCase/messageUseCase";
import MessageRepository from "../repository/messageRepository";
import UserRepository from "../repository/userRepository";
import CloudinaryUpload from "../services/cloudinaryUpload";
import { ImageUpload } from "../middleware/multer";
import SharpImages from "../services/sharpImages";
import BookTrainerRepository from "../repository/bookTrainerRepository";
import PushNotificationRepository from "../repository/pushNotificationRepository";

//services
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();
const generateOtp = new GenerateOtp();
const generateEmail = new GenerateEmail();
const cloudinaryUpload = new CloudinaryUpload();
const sharpImages = new SharpImages();

//repositories
const trainerRepository = new TrainerRepository();
const messageRepository = new MessageRepository();
const userRepository = new UserRepository();
const bookTrainerRepository = new BookTrainerRepository();
const pushNotificationRepo = new PushNotificationRepository();

//Use cases
const trainerUseCase = new TrainerUseCase(
  trainerRepository,
  encryptPassword,
  jwtToken,
  userRepository,
  cloudinaryUpload,
  sharpImages,
  bookTrainerRepository,
  pushNotificationRepo
);
const messageUseCase = new MessageUseCase(
  messageRepository,
  cloudinaryUpload,
  pushNotificationRepo
);

//controllers
const trainerController = new TrainerController(
  trainerUseCase,
  generateOtp,
  generateEmail
);
const messageController = new MessageController(messageUseCase);

const router = express.Router();
router.post("/login", (req, res, next) => trainerController.login(req, res, next));
router.post("/logout", (req, res, next) => trainerController.logout(req, res, next));
router.post("/forgot_password", (req, res, next) =>
  trainerController.forgotPassword(req, res, next)
);
router.post("/verify_forgot", (req, res, next) =>
  trainerController.verifyForgot(req, res, next)
);
router.patch("/update_password", (req, res, next) =>
  trainerController.updatePassword(req, res, next)
);
router.post("/resend_forgot_otp", (req, res, next) =>
  trainerController.resendForgotOtp(req, res, next)
);
router.get("/user_details/:userId", protect, (req, res, next) =>
  trainerController.getUserDetails(req, res, next)
);
router.post("/chat/create", protect, (req, res, next) =>
  messageController.createMessage(req, res, next)
);
router.get("/chat/fetch_messages", protect, (req, res, next) =>
  messageController.getMessages(req, res, next)
);
router.get("/chat/trainer_chat_data/:sender/:receiver", protect, (req, res, next) =>
  messageController.getConversationData(req, res, next)
);
router.get("/fetch_subscriptions", protect, (req, res, next) =>
  trainerController.getSubscriptions(req, res, next)
);
router.get("/fetch_trainer_data", protect, (req, res, next) =>
  trainerController.getTrainerData(req, res, next)
);
router.put("/edit_profile", protect, ImageUpload.single("image"), (req, res, next) =>
  trainerController.editProfile(req, res, next)
);
router.get("/fetch_dashboard", protect, (req, res, next) =>
  trainerController.getDashboardData(req, res, next)
);
router.post("/set_trainer_browser_token", protect, (req, res, next) =>
  trainerController.setTrainerBrowserToken(req, res, next)
);

export default router;
