import express from 'express'
import UserRepository from '../repository/userRepository';
import UserUseCase from '../../useCase/userUseCase';
import UserController from '../../adapters/controllers/userController';
import GenerateOtp from '../services/generateOtp';
import GenerateEmail from '../services/sendEmail';
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import GymRepository from '../repository/gymRepository';
import { protect } from '../middleware/userAuth';
import CartController from '../../adapters/controllers/cartController';
import CartUseCase from '../../useCase/cartUseCase';
import CartRepository from '../repository/cartRepository';
import SubscriptionController from '../../adapters/controllers/subscriptionController';
import SubscriptionUseCase from '../../useCase/subscriptionUseCase';
import PaymentRepository from '../repository/paymentRepository';
import SubscriptionRepository from '../repository/subscriptionRepository';
import CouponRepository from '../repository/couponRepository';
import CouponUseCase from '../../useCase/couponUseCase';
import CouponController from '../../adapters/controllers/couponController';



//services
const generateOtp =new GenerateOtp()
const generateEmail =new GenerateEmail()
const encryptPassword =new EncryptPassword()
const jwtToken=new JWTToken()



//repositories
const userRepository  = new UserRepository()
const gymRepository = new GymRepository()
const cartRepository = new CartRepository()
const paymentRepository = new PaymentRepository()
const subscriptionRepository = new SubscriptionRepository()
const couponRepository = new CouponRepository()



//useCases
const userCase = new UserUseCase(userRepository,encryptPassword,jwtToken,gymRepository,paymentRepository)
const cartCase = new CartUseCase(cartRepository,couponRepository,userRepository)
const subscriptionCase = new SubscriptionUseCase(cartRepository,paymentRepository,subscriptionRepository,couponRepository,userRepository)       
const couponCase = new CouponUseCase(couponRepository)                                                                                                                                                                                                                       


//controllers
const userController=new UserController(userCase,generateOtp,generateEmail)
const cartController=new CartController(cartCase)
const subscriptionController = new SubscriptionController(subscriptionCase,couponCase)
const couponController = new CouponController(couponCase)

 
const router = express.Router();


router.post('/sign_up',(req,res)=> userController.signUp(req,res))
router.post('/verify',(req,res)=> userController.userOtpVerification(req,res))
router.post('/resend_otp',(req,res)=> userController.resendOtp(req,res))
router.post('/login',(req,res)=> userController.login(req,res))
router.post('/logout',(req,res)=> userController.logout(req,res))
router.get('/gym_list',(req,res)=> userController.getGymList(req,res))
router.get('/gym_list_normal',(req,res)=> userController.getGymNormalList(req,res))
router.get('/gym_details/:id',(req,res)=> userController.getGymDetails(req,res))
router.post('/forgot_password',(req,res)=>userController.forgotPassword(req,res))
router.post('/verify_forgot',(req,res)=>userController.verifyForgot(req,res))
router.patch('/update_password',(req,res)=>userController.updatePassword(req,res))
router.post('/resend_forgot_otp',(req,res)=>userController.resendForgotOtp(req,res))
router.post('/add_to_cart',protect,(req,res)=>cartController.addToCart(req,res))
router.get('/get_checkout_details',protect,(req,res)=>cartController.getCheckoutDetails(req,res))
router.post('/add_new_subscription',protect,(req,res)=>subscriptionController.addNewSubscription(req,res))
router.post('/validate_coupon',protect,(req,res)=>couponController.validateCoupon(req,res))
router.get('/user_details',protect,(req,res)=>userController.getUserDetails(req,res))
router.post('/add_money_wallet',protect,(req,res)=>userController.addMoneyToWallet(req,res))





export default router