import express from 'express'
import GymController from '../../adapters/controllers/gymController';
import GymRepository from '../repository/gymRepository';
import GymUseCase from '../../useCase/gymUseCase';
import EncryptPassword from '../services/bcryptPassword';
import GenerateOtp from '../services/generateOtp';
import GenerateEmail from '../services/sendEmail';
import JWTToken from '../services/generateToken';
import { protect } from '../middleware/gymAuth';
  

    
//services
const encryptPassword= new EncryptPassword()
const generateOtp = new GenerateOtp()
const generateEmail=new GenerateEmail()
const jwtToken=new JWTToken()

//repositories
const gymRepository=new GymRepository()


//useCases
const gymUseCase=new GymUseCase(gymRepository,encryptPassword,generateEmail,jwtToken)


//controllers
const gymController=new GymController(gymUseCase,generateOtp,generateEmail)



const router = express.Router();


router.post('/gym_register',(req,res)=>gymController.gymRegister(req,res))
router.post('/gym_login',(req,res)=>gymController.gymLogin(req,res))
router.post('/gym_otp_verify',(req,res)=>gymController.gymOtpVerification(req,res))
router.post('/resend_otp',(req,res)=>gymController.resendOtp(req,res))
router.post('/logout',(req,res)=>gymController.logout(req,res))
router.patch('/edit_gym_subscription',(req,res)=>gymController.editGymSubscription(req,res))
router.get('/fetch_gym_subscription/:gymId',(req,res)=>gymController.fetchGymSubscription(req,res))
router.post('/forgot_password',(req,res)=>gymController.forgotPassword(req,res))
router.post('/verify_forgot',(req,res)=>gymController.verifyForgot(req,res))
router.patch('/update_password',(req,res)=>gymController.updatePassword(req,res))
router.post('/resend_forgot_otp',(req,res)=>gymController.resendForgotOtp(req,res))



export default router