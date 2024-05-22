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
import TrainerRepository from '../repository/trainerRepository';
import BookTrainerController from '../../adapters/controllers/bookTrainerController';
import BookTrainerUseCase from '../../useCase/bookTrainerUseCase';
import BookTrainerRepository from '../repository/bookTrainerRepository';
import GenerateQrCode from '../services/generateQrCode';
import MessageUseCase from '../../useCase/messageUseCase';
import MessageController from '../../adapters/controllers/messageController';
import MessageRepository from '../repository/messageRepository';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import SharpImages from '../services/sharpImages';
import { ImageUpload } from '../middleware/multer';
import GymReviewsRepository from '../repository/gymReviewsRepository';



//services
const generateOtp =new GenerateOtp()
const generateEmail =new GenerateEmail()
const encryptPassword =new EncryptPassword()
const jwtToken=new JWTToken()
const generateQrCode = new GenerateQrCode()
const sharpImages = new SharpImages()
const cloudinaryUpload = new CloudinaryUpload()


//repositories
const userRepository  = new UserRepository()
const gymRepository = new GymRepository()
const cartRepository = new CartRepository()
const subscriptionRepository = new SubscriptionRepository()
const couponRepository = new CouponRepository()
const trainerRepository = new TrainerRepository()
const paymentRepository = new PaymentRepository()
const bookTrainerRepository = new BookTrainerRepository()
const messageRepository = new MessageRepository()
const gymReviewsRepository = new GymReviewsRepository()



//useCases
const userCase = new UserUseCase(userRepository,encryptPassword,jwtToken,gymRepository,paymentRepository,trainerRepository,sharpImages,cloudinaryUpload,subscriptionRepository,gymReviewsRepository)
const cartCase = new CartUseCase(cartRepository,couponRepository,userRepository,subscriptionRepository)
const subscriptionCase = new SubscriptionUseCase(cartRepository,paymentRepository,subscriptionRepository,couponRepository,userRepository,generateQrCode,generateEmail,gymRepository)       
const couponCase = new CouponUseCase(couponRepository)      
const bookTrainerUseCase = new BookTrainerUseCase(paymentRepository,bookTrainerRepository)   
const messageUseCase=new MessageUseCase(messageRepository)                                                                                                                                                                                                              


//controllers
const userController=new UserController(userCase,generateOtp,generateEmail,subscriptionCase)
const cartController=new CartController(cartCase)
const subscriptionController = new SubscriptionController(subscriptionCase,couponCase)
const couponController = new CouponController(couponCase)
const bookTrainerController = new BookTrainerController(bookTrainerUseCase)
const messageController = new MessageController(messageUseCase)

 
const router = express.Router();


router.post('/sign_up',(req,res)=> userController.signUp(req,res))
router.post('/verify',(req,res)=> userController.userOtpVerification(req,res))
router.post('/resend_otp',(req,res)=> userController.resendOtp(req,res))
router.post('/login',(req,res)=> userController.login(req,res))
router.post('/logout',(req,res)=> userController.logout(req,res))
router.get('/gym_list',(req,res)=> userController.getGymList(req,res))
router.get('/gym_list_normal',(req,res)=> userController.getGymNormalList(req,res))
router.get('/gym_details/:id',(req,res)=> userController.getGymDetails(req,res))
router.get('/fetch_trainers',(req,res)=>userController.getTrainers(req,res))

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
router.get('/fetch_subscriptions',protect,(req,res)=>userController.getSubscription(req,res))
router.post('/book_trainer',protect,(req,res)=>bookTrainerController.bookTrainer(req,res))
router.get('/fetch_booked_trainers',protect,(req,res)=>userController.getBookedTrainers(req,res))
router.get('/trainer_details/:trainerId',protect,(req,res)=>userController.getTrainerDetails(req,res))
router.post('/chat/create',protect,(req,res)=>messageController.createMessage(req,res))
router.get('/chat/user_chat_data/:sender/:receiver',protect,(req,res)=>messageController.getConversationData(req,res))
router.post('/edit_profile',ImageUpload.single("profilePic"),protect,(req,res)=>userController.editProfile(req,res))
router.get('/is_review_possible/:gymId',protect,(req,res)=>userController.isReviewPossible(req,res))
router.post('/add_review',protect,(req,res)=>userController.addGymReview(req,res))


export default router