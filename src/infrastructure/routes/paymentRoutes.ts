import express from "express";
import PaymentController from "../../adapters/controllers/paymentController";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import CartRepository from "../repository/cartRepository";
import SubscriptionRepository from "../repository/subscriptionRepository";
import PaymentRepository from "../repository/paymentRepository";
import CouponRepository from "../repository/couponRepository";
import UserRepository from "../repository/userRepository";
import BookTrainerUseCase from "../../useCase/bookTrainerUseCase";
import BookTrainerRepository from "../repository/bookTrainerRepository";
import GenerateQrCode from "../services/generateQrCode";
import GenerateEmail from "../services/sendEmail";
import GymRepository from "../repository/gymRepository";

//services
const generateQrCode = new GenerateQrCode();
const generateEmail = new GenerateEmail();

//repositories
const cartRepository = new CartRepository();
const subscriptionRepository = new SubscriptionRepository();
const paymentRepository = new PaymentRepository();
const couponRepository = new CouponRepository();
const userRepository = new UserRepository();
const bookTrainerRepository = new BookTrainerRepository();
const gymRepository = new GymRepository();

//Use cases
const subscriptionUseCase = new SubscriptionUseCase(
  cartRepository,
  paymentRepository,
  subscriptionRepository,
  couponRepository,
  userRepository,
  generateQrCode,
  generateEmail,
  gymRepository
);
const bookTrainerUseCase = new BookTrainerUseCase(
  paymentRepository,
  bookTrainerRepository
);

//controllers
const paymentController = new PaymentController(
  subscriptionUseCase,
  userRepository,
  bookTrainerUseCase
);

const router = express.Router();

router.post("/webhook", express.raw({ type: "application/json" }), (req, res) =>
  paymentController.confirmPayment(req, res)
);
router.post(
  "/webhook/add_wallet",
  express.raw({ type: "application/json" }),
  (req, res) => paymentController.addWalletPayment(req, res)
);
router.post(
  "/webhook/add_trainer",
  express.raw({ type: "application/json" }),
  (req, res) => paymentController.bookTrainerPayment(req, res)
);

export default router;
