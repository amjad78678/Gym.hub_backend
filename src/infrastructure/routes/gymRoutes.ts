import express from 'express'
import GymController from '../../adapters/controllers/gymController';
import GymRepository from '../repository/gymRepository';
import GymUseCase from '../../useCase/gymUseCase';
import EncryptPassword from '../services/bcryptPassword';
import GenerateOtp from '../services/generateOtp';
import GenerateEmail from '../services/sendEmail';
import JWTToken from '../services/generateToken';
import { protect } from '../middleware/gymAuth';
import TrainerRepository from '../repository/trainerRepository';
import { ImageUpload } from '../middleware/multer';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import SharpImages from '../services/sharpImages';
import CouponController from '../../adapters/controllers/couponController';
import CouponUseCase from '../../useCase/couponUseCase';
import CouponRepository from '../repository/couponRepository';
  

    
//services
const encryptPassword= new EncryptPassword()
const generateOtp = new GenerateOtp()
const generateEmail=new GenerateEmail()
const jwtToken=new JWTToken()
const cloudinaryUpload = new CloudinaryUpload()
const sharpImages = new SharpImages()

//repositories
const gymRepository=new GymRepository()
const trainerRepository=new TrainerRepository()
const couponRepository = new CouponRepository()


//useCases
const gymUseCase = new GymUseCase(gymRepository, encryptPassword, generateEmail, jwtToken, trainerRepository, cloudinaryUpload, sharpImages);
const couponUseCase = new CouponUseCase(couponRepository)


//controllers
const gymController=new GymController(gymUseCase,generateOtp,generateEmail,cloudinaryUpload,sharpImages)
const couponController = new CouponController(couponUseCase)



const router = express.Router();


router.post('/gym_register',ImageUpload.array('images', 4),(req,res)=>gymController.gymRegister(req,res))
router.post('/gym_login',(req,res)=>gymController.gymLogin(req,res))
router.post('/gym_otp_verify',(req,res)=>gymController.gymOtpVerification(req,res))
router.post('/resend_otp',(req,res)=>gymController.resendOtp(req,res))
router.post('/logout',(req,res)=>gymController.logout(req,res))
router.patch('/edit_gym_subscription',protect,(req,res)=>gymController.editGymSubscription(req,res))
router.get('/fetch_gym_subscription',protect,(req,res)=>gymController.fetchGymSubscription(req,res))
router.post('/forgot_password',(req,res)=>gymController.forgotPassword(req,res))
router.post('/verify_forgot',(req,res)=>gymController.verifyForgot(req,res))
router.patch('/update_password',(req,res)=>gymController.updatePassword(req,res))
router.post('/resend_forgot_otp',(req,res)=>gymController.resendForgotOtp(req,res))
router.get('/fetch_gym_trainers',(protect),(req,res)=>gymController.fetchGymTrainers(req,res))
router.post('/add_gym_trainer',(protect),ImageUpload.single('imageUrl'),(req,res)=>gymController.addGymTrainer(req,res))
router.put('/update_gym_trainer',(protect),ImageUpload.single('imageUrl'),(req,res)=>gymController.updateGymTrainer(req,res))
router.get('/fetch_coupons',(protect),(req,res)=>couponController.getAllCoupons(req,res))
router.post('/add_coupon',(protect),(req,res)=>couponController.addCoupon(req,res))
router.put('/update_coupon',(protect),(req,res)=>couponController.editCoupon(req,res))


 
export default router