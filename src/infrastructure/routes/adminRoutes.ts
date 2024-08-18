import express from 'express'
import AdminUseCase from '../../useCase/adminUseCase';
import AdminController from '../../adapters/controllers/adminController';
import GymRepository from '../repository/gymRepository';
import GenerateEmail from '../services/sendEmail';
import JWTToken from '../services/generateToken';
import UserRepository from '../repository/userRepository';
import SubscriptionRepository from '../repository/subscriptionRepository';
import TrainerRepository from '../repository/trainerRepository';
import { ImageUpload } from '../middleware/multer';
import BannerController from '../../adapters/controllers/bannerController';
import BannerUseCase from '../../useCase/bannerUseCase';
import BannerRepository from '../repository/bannerRepository';
import SharpImages from '../services/sharpImages';
import CloudinaryUpload from '../services/cloudinaryUpload';
import UserController from '../../adapters/controllers/userController';
import BookTrainerRepository from '../repository/bookTrainerRepository';
import CartRepository from '../repository/cartRepository';


//services
const generateEmail=new GenerateEmail()
const jwtToken=new JWTToken()
const sharpImages=new SharpImages()
const cloudinaryUpload = new CloudinaryUpload()


//repositories
const gymRepository=new GymRepository()
const userRepository=new UserRepository()
const subscriptionRepository = new SubscriptionRepository()
const trainerRepository = new TrainerRepository()
const bannerRepository = new BannerRepository()
const bookTrainerRepository = new BookTrainerRepository()
const cartRepository = new CartRepository()


//usecases

const adminUseCase=new AdminUseCase(gymRepository,generateEmail,jwtToken,userRepository,subscriptionRepository,trainerRepository,bookTrainerRepository,cartRepository)
const bannerUseCase=new BannerUseCase(bannerRepository,sharpImages,cloudinaryUpload)

//controllers

const adminController=new AdminController(adminUseCase)
const bannerController=new BannerController(bannerUseCase)



const router = express.Router();


router.get('/get_gym_details',(req,res,next)=>adminController.getGymDetails(req,res,next))
router.put('/gym_admin_response',(req,res,next)=>adminController.gymAdminResponse(req,res,next))
router.patch('/gym_block_action/:id',(req,res,next)=>adminController.gymBlockAction(req,res,next))
router.delete('/delete_gym/:id',(req,res,next)=>adminController.deleteGym(req,res,next))
router.post('/admin_login',(req,res,next)=>adminController.adminLogin(req,res,next))
router.post('/admin_logout',(req,res,next)=>adminController.adminLogout(req,res,next))
router.get('/fetch_users',(req,res,next)=>adminController.fetchUsers(req,res,next))
router.patch('/update_user/:id',(req,res,next)=>adminController.updateUser(req,res,next))
router.get('/fetch_subscriptions',(req,res,next)=>adminController.fetchSubscriptions(req,res,next))
router.get('/fetch_gym_with_id/:gymId',(req,res,next)=>adminController.fetchGymWithId(req,res,next))
router.get('/fetch_trainers',(req,res,next)=>adminController.getTrainers(req,res,next))
router.put('/update_trainer',(req,res,next)=>adminController.updateTrainer(req,res,next))
router.post('/add_banner',ImageUpload.single('bannerImage'),(req,res,next)=>bannerController.addBanner(req,res,next))
router.get('/fetch_banners',(req,res,next)=>bannerController.fetchBanners(req,res,next))
router.put('/update_banner',ImageUpload.single('bannerImage'),(req,res,next)=>bannerController.updateBanner(req,res,next))
router.get('/recently_users',(req,res,next)=>adminController.fetchRecentlyUsers(req,res,next))
 
export default router  