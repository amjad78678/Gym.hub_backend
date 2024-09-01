import express from "express";
import UserRepository from "../repository/userRepository";
import UserUseCase from "../../useCase/userUseCase";
import UserController from "../../adapters/controllers/userController";
import GenerateOtp from "../services/generateOtp";
import GenerateEmail from "../services/sendEmail";
import EncryptPassword from "../services/bcryptPassword";
import JWTToken from "../services/generateToken";
import GymRepository from "../repository/gymRepository";
import { protect } from "../middleware/userAuth";
import CartController from "../../adapters/controllers/cartController";
import CartUseCase from "../../useCase/cartUseCase";
import CartRepository from "../repository/cartRepository";
import SubscriptionController from "../../adapters/controllers/subscriptionController";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import PaymentRepository from "../repository/paymentRepository";
import SubscriptionRepository from "../repository/subscriptionRepository";
import CouponRepository from "../repository/couponRepository";
import CouponUseCase from "../../useCase/couponUseCase";
import CouponController from "../../adapters/controllers/couponController";
import TrainerRepository from "../repository/trainerRepository";
import BookTrainerController from "../../adapters/controllers/bookTrainerController";
import BookTrainerUseCase from "../../useCase/bookTrainerUseCase";
import BookTrainerRepository from "../repository/bookTrainerRepository";
import GenerateQrCode from "../services/generateQrCode";
import MessageUseCase from "../../useCase/messageUseCase";
import MessageController from "../../adapters/controllers/messageController";
import MessageRepository from "../repository/messageRepository";
import CloudinaryUpload from "../services/cloudinaryUpload";
import SharpImages from "../services/sharpImages";
import { ImageUpload } from "../middleware/multer";
import GymReviewsRepository from "../repository/gymReviewsRepository";
import BannerController from "../../adapters/controllers/bannerController";
import BannerUseCase from "../../useCase/bannerUseCase";
import BannerRepository from "../repository/bannerRepository";
import PushNotificationRepository from "../repository/pushNotificationRepository";
import GeminiChatbot from "../services/chatbot";

//services
const generateOtp = new GenerateOtp();
const generateEmail = new GenerateEmail();
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();
const generateQrCode = new GenerateQrCode();
const sharpImages = new SharpImages();
const cloudinaryUpload = new CloudinaryUpload();

//repositories
const userRepository = new UserRepository();
const gymRepository = new GymRepository();
const cartRepository = new CartRepository();
const subscriptionRepository = new SubscriptionRepository();
const couponRepository = new CouponRepository();
const trainerRepository = new TrainerRepository();
const paymentRepository = new PaymentRepository();
const bookTrainerRepository = new BookTrainerRepository();
const messageRepository = new MessageRepository();
const gymReviewsRepository = new GymReviewsRepository();
const bannerRepository = new BannerRepository();
const pushNotificationRepo = new PushNotificationRepository();
const geminiChatbot = new GeminiChatbot();

//useCases
const userCase = new UserUseCase(
  userRepository,
  encryptPassword,
  jwtToken,
  gymRepository,
  paymentRepository,
  trainerRepository,
  sharpImages,
  cloudinaryUpload,
  subscriptionRepository,
  gymReviewsRepository,
  pushNotificationRepo,
  geminiChatbot
);
const cartCase = new CartUseCase(
  cartRepository,
  couponRepository,
  userRepository,
  subscriptionRepository
);
const subscriptionCase = new SubscriptionUseCase(
  cartRepository,
  paymentRepository,
  subscriptionRepository,
  couponRepository,
  userRepository,
  generateQrCode,
  generateEmail,
  gymRepository
);
const couponCase = new CouponUseCase(couponRepository);
const bookTrainerUseCase = new BookTrainerUseCase(
  paymentRepository,
  bookTrainerRepository
);
const messageUseCase = new MessageUseCase(
  messageRepository,
  cloudinaryUpload,
  pushNotificationRepo
);
const bannerUseCase = new BannerUseCase(
  bannerRepository,
  sharpImages,
  cloudinaryUpload
);

//controllers
const userController = new UserController(
  userCase,
  generateOtp,
  generateEmail,
  subscriptionCase
);
const cartController = new CartController(cartCase);
const subscriptionController = new SubscriptionController(
  subscriptionCase,
  couponCase
);
const couponController = new CouponController(couponCase);
const bookTrainerController = new BookTrainerController(bookTrainerUseCase);
const messageController = new MessageController(messageUseCase);
const bannerController = new BannerController(bannerUseCase);

const router = express.Router();

router.post("/sign_up", (req, res, next) =>
  userController.signUp(req, res, next)
);
router.post("/verify", (req, res, next) =>
  userController.userOtpVerification(req, res, next)
);
router.post("/resend_otp", (req, res, next) =>
  userController.resendOtp(req, res, next)
);
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.post("/logout", (req, res, next) =>
  userController.logout(req, res, next)
);
router.get("/gym_list", (req, res, next) =>
  userController.getGymList(req, res, next)
);
router.get("/max_price_gym", (req, res, next) =>
  userController.getMaxPriceGym(req, res, next)
);
router.get("/gym_list_normal", (req, res, next) =>
  userController.getGymNormalList(req, res, next)
);
router.get("/gym_details/:id", (req, res, next) =>
  userController.getGymDetails(req, res, next)
);
router.get("/fetch_trainers", (req, res, next) =>
  userController.getTrainers(req, res, next)
);
router.get("/max_price_trainer", (req, res, next) =>
  userController.getMaxPriceTrainer(req, res, next)
);
router.post("/forgot_password", (req, res, next) =>
  userController.forgotPassword(req, res, next)
);
router.post("/verify_forgot", (req, res, next) =>
  userController.verifyForgot(req, res, next)
);
router.patch("/update_password", (req, res, next) =>
  userController.updatePassword(req, res, next)
);
router.post("/resend_forgot_otp", (req, res, next) =>
  userController.resendForgotOtp(req, res, next)
);
router.get("/is_review_possible/:gymId", protect, (req, res, next) =>
  userController.isReviewPossible(req, res, next)
);
router.post("/add_to_cart", protect, (req, res, next) =>
  cartController.addToCart(req, res, next)
);
router.get("/get_checkout_details", protect, (req, res, next) =>
  cartController.getCheckoutDetails(req, res, next)
);
router.post("/add_new_subscription", protect, (req, res, next) =>
  subscriptionController.addNewSubscription(req, res, next)
);
router.post("/validate_coupon", protect, (req, res, next) =>
  couponController.validateCoupon(req, res, next)
);
router.get("/user_details", protect, (req, res, next) =>
  userController.getUserDetails(req, res, next)
);
router.post("/add_money_wallet", protect, (req, res, next) =>
  userController.addMoneyToWallet(req, res, next)
);
router.get("/fetch_subscriptions", protect, (req, res, next) =>
  userController.getSubscription(req, res, next)
);
router.post("/book_trainer", protect, (req, res, next) =>
  bookTrainerController.bookTrainer(req, res, next)
);
router.get("/fetch_booked_trainers", protect, (req, res, next) =>
  userController.getBookedTrainers(req, res, next)
);
router.get("/trainer_details/:trainerId", protect, (req, res, next) =>
  userController.getTrainerDetails(req, res, next)
);
router.post(
  "/edit_profile",
  ImageUpload.single("profilePic"),
  protect,
  (req, res, next) => userController.editProfile(req, res, next)
);

router.post("/add_review", protect, (req, res, next) =>
  userController.addGymReview(req, res, next)
);
router.get("/fetch_gym_reviews/:gymId", (req, res, next) =>
  userController.getGymReviews(req, res, next)
);
router.post("/update_rating", protect, (req, res, next) =>
  userController.updateRatingGym(req, res, next)
);
router.get("/workouts_body_list", (req, res, next) =>
  userController.getWorkoutsList(req, res, next)
);
router.get("/exercises/:body", (req, res, next) =>
  userController.getExercisesDetails(req, res, next)
);
router.get("/fetch_banners", (req, res, next) =>
  bannerController.fetchBanners(req, res, next)
);
router.post("/send_chatbot_message", (req, res, next) =>
  userController.sendChatbotMessage(req, res, next)
);

//Chatting
router.post("/chat/create", protect, (req, res, next) =>
  messageController.createMessage(req, res, next)
);
router.get(
  "/chat/user_chat_data/:sender/:receiver",
  protect,
  (req, res, next) => messageController.getConversationData(req, res, next)
);
router.post(
  "/upload_chat_files",
  ImageUpload.array("files", 5),
  protect,
  (req, res, next) => messageController.uploadChatFiles(req, res, next)
);
router.post("/set_client_token", protect, (req, res, next) =>
  userController.setBrowserToken(req, res, next)
);

export default router;
