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
import CloudinaryUpload from '../utils/cloudinaryUpload';
import UserController from '../../adapters/controllers/userController';
import BookTrainerRepository from '../repository/bookTrainerRepository';


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


//usecases

const adminUseCase=new AdminUseCase(gymRepository,generateEmail,jwtToken,userRepository,subscriptionRepository,trainerRepository,bookTrainerRepository)
const bannerUseCase= new BannerUseCase(bannerRepository,sharpImages,cloudinaryUpload)

//controllers

const adminController=new AdminController(adminUseCase)
const bannerController=new BannerController(bannerUseCase)



const router = express.Router();


router.get('/get_gym_details',(req,res)=>adminController.getGymDetails(req,res))
router.put('/gym_admin_response',(req,res)=>adminController.gymAdminResponse(req,res))
router.patch('/gym_block_action/:id',(req,res)=>adminController.gymBlockAction(req,res))
router.delete('/delete_gym/:id',(req,res)=>adminController.deleteGym(req,res))
router.post('/admin_login',(req,res)=>adminController.adminLogin(req,res))
router.post('/admin_logout',(req,res)=>adminController.adminLogout(req,res))
router.get('/fetch_users',(req,res)=>adminController.fetchUsers(req,res))
router.patch('/update_user/:id',(req,res)=>adminController.updateUser(req,res))
router.get('/fetch_subscriptions',(req,res)=>adminController.fetchSubscriptions(req,res))
router.get('/fetch_gym_with_id/:gymId',(req,res)=>adminController.fetchGymWithId(req,res))
router.get('/fetch_trainers',(req,res)=>adminController.getTrainers(req,res))
router.put('/update_trainer',(req,res)=>adminController.updateTrainer(req,res))
router.post('/add_banner',ImageUpload.single('bannerImage'),(req,res)=>bannerController.addBanner(req,res))
router.get('/fetch_banners',(req,res)=>bannerController.fetchBanners(req,res))
router.put('/update_banner',ImageUpload.single('bannerImage'),(req,res)=>bannerController.updateBanner(req,res))
router.get('/recently_users',(req,res)=>adminController.fetchRecentlyUsers(req,res))
 
export default router 