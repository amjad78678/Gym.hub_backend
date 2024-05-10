import express from 'express'
import TrainerController from '../../adapters/controllers/trainerController';
import TrainerUseCase from '../../useCase/trainerUseCase';
import TrainerRepository from '../repository/trainerRepository';
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';


//services
const encryptPassword = new EncryptPassword()
const jwtToken = new JWTToken()

//repositories
const trainerRepository = new TrainerRepository()


//Use cases
const trainerUseCase = new TrainerUseCase(trainerRepository,encryptPassword,jwtToken)


//controllers
const trainerController = new TrainerController(trainerUseCase)


const router = express.Router();

router.post('/login',(req,res)=>trainerController.login(req,res))
router.post('/logout',(req,res)=>trainerController.logout(req,res))

export default router