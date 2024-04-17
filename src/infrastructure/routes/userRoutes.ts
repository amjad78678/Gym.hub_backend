import express from 'express'
import UserRepository from '../repository/userRepository';
import UserUseCase from '../../useCase/userUseCase';
import UserController from '../../adapters/controllers/userController';
import GenerateOtp from '../services/generateOtp';
import GenerateEmail from '../services/sendEmail';
import EncryptPassword from '../services/bcryptPassword';



//services
const generateOtp =new GenerateOtp()
const generateEmail =new GenerateEmail()
const encryptPassword =new EncryptPassword()



//repositories
const userRepository  = new UserRepository()



//useCases
const userCase = new UserUseCase(userRepository,encryptPassword)                                                                                                                                                                                                                              


//controllers
const userController=new UserController(userCase,generateOtp,generateEmail)


const router = express.Router();


router.post('/sign_up',(req,res)=> userController.signUp(req,res))
router.post('/verify',(req,res)=> userController.userOtpVerification(req,res))



export default router