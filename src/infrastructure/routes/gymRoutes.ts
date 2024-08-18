import express from "express";
import GymController from "../../adapters/controllers/gymController";
import GymRepository from "../repository/gymRepository";
import GymUseCase from "../../useCase/gymUseCase";
import EncryptPassword from "../services/bcryptPassword";
import GenerateOtp from "../services/generateOtp";
import GenerateEmail from "../services/sendEmail";
import JWTToken from "../services/generateToken";
import { protect } from "../middleware/gymAuth";
import TrainerRepository from "../repository/trainerRepository";
import { ImageUpload } from "../middleware/multer";
import CloudinaryUpload from "../services/cloudinaryUpload";
import SharpImages from "../services/sharpImages";
import CouponController from "../../adapters/controllers/couponController";
import CouponUseCase from "../../useCase/couponUseCase";
import CouponRepository from "../repository/couponRepository";
import SubscriptionRepository from "../repository/subscriptionRepository";

//services
const encryptPassword = new EncryptPassword();
const generateOtp = new GenerateOtp();
const generateEmail = new GenerateEmail();
const jwtToken = new JWTToken();
const cloudinaryUpload = new CloudinaryUpload();
const sharpImages = new SharpImages();

//repositories
const gymRepository = new GymRepository();
const trainerRepository = new TrainerRepository();
const couponRepository = new CouponRepository();
const subscriptionRepository = new SubscriptionRepository();

//useCases
const gymUseCase = new GymUseCase(
  gymRepository,
  encryptPassword,
  generateEmail,
  jwtToken,
  trainerRepository,
  cloudinaryUpload,
  sharpImages,
  subscriptionRepository
);
const couponUseCase = new CouponUseCase(couponRepository);

//controllers
const gymController = new GymController(
  gymUseCase,
  generateOtp,
  generateEmail,
  cloudinaryUpload,
  sharpImages
);
const couponController = new CouponController(couponUseCase);

const router = express.Router();

router.post("/gym_register", (req, res, next) => gymController.gymRegister(req, res, next));
router.post("/gym_login", (req, res, next) => gymController.gymLogin(req, res, next));
router.post("/gym_otp_verify", (req, res, next) =>
  gymController.gymOtpVerification(req, res, next)
);
router.post("/resend_otp", (req, res, next) => gymController.resendOtp(req, res, next));
router.post("/logout", (req, res, next) => gymController.logout(req, res, next));
router.patch("/edit_gym_subscription", protect, (req, res, next) =>
  gymController.editGymSubscription(req, res, next)
);
router.get("/fetch_gym_subscription", protect, (req, res, next) =>
  gymController.fetchGymSubscription(req, res, next)
);
router.post("/forgot_password", (req, res, next) =>
  gymController.forgotPassword(req, res, next)
);
router.post("/verify_forgot", (req, res, next) =>
  gymController.verifyForgot(req, res, next)
);
router.patch("/update_password", (req, res, next) =>
  gymController.updatePassword(req, res, next)
);
router.post("/resend_forgot_otp", (req, res, next) =>
  gymController.resendForgotOtp(req, res, next)
);
router.get("/fetch_gym_trainers", protect, (req, res, next) =>
  gymController.fetchGymTrainers(req, res, next)
);
router.post(
  "/add_gym_trainer",
  protect,
  ImageUpload.single("imageUrl"),
  (req, res, next) => gymController.addGymTrainer(req, res, next)
);
router.put(
  "/update_gym_trainer",
  protect,
  ImageUpload.single("imageUrl"),
  (req, res, next) => gymController.updateGymTrainer(req, res, next)
);
router.get("/fetch_coupons", protect, (req, res, next) =>
  couponController.getAllCoupons(req, res, next)
);
router.post("/add_coupon", protect, (req, res, next) =>
  couponController.addCoupon(req, res, next)
);
router.put("/update_coupon", protect, (req, res, next) =>
  couponController.editCoupon(req, res, next)
);
router.get("/fetch_gym_data", protect, (req, res, next) =>
  gymController.fetchGymData(req, res, next)
);
router.get("/booked_memberships", protect, (req, res, next) =>
  gymController.bookedMemberships(req, res, next)
);
router.get("/fetch_dashboard_details", protect, (req, res, next) =>
  gymController.fetchDashboardDetails(req, res, next)
);
router.put("/edit_gym_profile", protect, (req, res, next) =>
  gymController.editGymProfile(req, res, next)
);
router.patch(
  "/edit_gym_images",
  protect,
  ImageUpload.array("images", 4),
  (req, res, next) => gymController.editGymImages(req, res, next)
);

export default router;
