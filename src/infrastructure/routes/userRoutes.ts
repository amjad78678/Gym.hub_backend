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



//useCases
const userCase = new UserUseCase(userRepository,encryptPassword,jwtToken,gymRepository)
const cartCase = new CartUseCase(cartRepository)
const subscriptionCase = new SubscriptionUseCase(cartRepository,paymentRepository,subscriptionRepository)                                                                                                                                                                                                                              


//controllers
const userController=new UserController(userCase,generateOtp,generateEmail)
const cartController=new CartController(cartCase)
const subscriptionController = new SubscriptionController(subscriptionCase)

 
const router = express.Router();


router.post('/sign_up',(req,res)=> userController.signUp(req,res))
router.post('/verify',(req,res)=> userController.userOtpVerification(req,res))
router.post('/resend_otp',(req,res)=> userController.resendOtp(req,res))
router.post('/login',(req,res)=> userController.login(req,res))
router.post('/logout',(req,res)=> userController.logout(req,res))
router.get('/gym_list',(req,res)=> userController.getGymList(req,res))
router.get('/gym_details/:id',(req,res)=> userController.getGymDetails(req,res))
router.post('/forgot_password',(req,res)=>userController.forgotPassword(req,res))
router.post('/verify_forgot',(req,res)=>userController.verifyForgot(req,res))
router.patch('/update_password',(req,res)=>userController.updatePassword(req,res))
router.post('/resend_forgot_otp',(req,res)=>userController.resendForgotOtp(req,res))
router.post('/add_to_cart',protect,(req,res)=>cartController.addToCart(req,res))
router.get('/get_checkout_details',protect,(req,res)=>cartController.getCheckoutDetails(req,res))
router.post('/add_new_subscription',protect,(req,res)=>subscriptionController.addNewSubscription(req,res))





export default router