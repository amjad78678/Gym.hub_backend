import express from 'express'
import GymController from '../../adapters/controllers/gymController';
import GymRepository from '../repository/gymRepository';
import GymUseCase from '../../useCase/gymUseCase';
import EncryptPassword from '../services/bcryptPassword';
import GenerateOtp from '../services/generateOtp';
import GenerateEmail from '../services/sendEmail';



//services
const encryptPassword= new EncryptPassword()
const generateOtp = new GenerateOtp()
const generateEmail=new GenerateEmail()

//repositories
const gymRepository=new GymRepository()


//useCases
const gymUseCase=new GymUseCase(gymRepository,encryptPassword,generateEmail)


//controllers
const gymController=new GymController(gymUseCase,generateOtp,generateEmail)



const router = express.Router();


router.post('/gym_register',(req,res)=>gymController.gymRegister(req,res))
router.post('/gym_otp_verify',(req,res)=>gymController.gymOtpVerification(req,res))
router.post('/resend_otp',(req,res)=>gymController.resendOtp(req,res))



export default router