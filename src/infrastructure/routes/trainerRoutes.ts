import express from 'express'
import TrainerController from '../../adapters/controllers/trainerController';
import TrainerUseCase from '../../useCase/trainerUseCase';
import TrainerRepository from '../repository/trainerRepository';
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import GenerateOtp from '../services/generateOtp';
import GenerateEmail from '../services/sendEmail';


//services
const encryptPassword = new EncryptPassword()
const jwtToken = new JWTToken()
const generateOtp=new GenerateOtp()
const generateEmail=new GenerateEmail()

//repositories
const trainerRepository = new TrainerRepository()


//Use cases
const trainerUseCase = new TrainerUseCase(trainerRepository,encryptPassword,jwtToken)


//controllers
const trainerController = new TrainerController(trainerUseCase,generateOtp,generateEmail)


const router = express.Router();

router.post('/login',(req,res)=>trainerController.login(req,res))
router.post('/logout',(req,res)=>trainerController.logout(req,res))
router.post('/forgot_password',(req,res)=>trainerController.forgotPassword(req,res))
router.post('/verify_forgot',(req,res)=>trainerController.verifyForgot(req,res))
router.patch('/update_password',(req,res)=>trainerController.updatePassword(req,res))
router.post('/resend_forgot_otp',(req,res)=>trainerController.resendForgotOtp(req,res))

export default router