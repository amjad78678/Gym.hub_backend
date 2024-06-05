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
import CloudinaryUpload from "../utils/cloudinaryUpload";
import { ImageUpload } from "../middleware/multer";
import SharpImages from "../services/sharpImages";

//services
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();
const generateOtp = new GenerateOtp();
const generateEmail = new GenerateEmail();
const cloudinaryUpload= new CloudinaryUpload();
const sharpImages = new SharpImages();

//repositories
const trainerRepository = new TrainerRepository();
const messageRepository = new MessageRepository();
const userRepository = new UserRepository();

//Use cases
const trainerUseCase = new TrainerUseCase(
  trainerRepository,
  encryptPassword,
  jwtToken,
  userRepository,
  cloudinaryUpload,
  sharpImages
);
const messageUseCase= new MessageUseCase(messageRepository,cloudinaryUpload)

//controllers
const trainerController = new TrainerController(
  trainerUseCase,
  generateOtp,
  generateEmail
);
const messageController = new MessageController(messageUseCase)

const router = express.Router();
router.post("/login", (req, res) => trainerController.login(req, res));
router.post("/logout", (req, res) => trainerController.logout(req, res));
router.post("/forgot_password", (req, res) =>
  trainerController.forgotPassword(req, res)
);
router.post("/verify_forgot", (req, res) =>
  trainerController.verifyForgot(req, res)
);
router.patch("/update_password", (req, res) =>
  trainerController.updatePassword(req, res)
);
router.post("/resend_forgot_otp", (req, res) =>
  trainerController.resendForgotOtp(req, res)
);
router.get('/user_details/:userId',protect,(req,res)=>trainerController.getUserDetails(req,res))
router.post('/chat/create',protect,(req,res)=>messageController.createMessage(req,res))
router.get('/chat/fetch_messages',protect,(req,res)=>messageController.getMessages(req,res))
router.get('/chat/trainer_chat_data/:sender/:receiver',protect,(req,res)=>messageController.getConversationData(req,res))
router.get('/fetch_subscriptions',protect,(req,res)=>trainerController.getSubscriptions(req,res))
router.get('/fetch_trainer_data',protect,(req,res)=>trainerController.getTrainerData(req,res))
router.put('/edit_profile',protect,ImageUpload.single("image"),(req,res)=>trainerController.editProfile(req,res))

export default router;
