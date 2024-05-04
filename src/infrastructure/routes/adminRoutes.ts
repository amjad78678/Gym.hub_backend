import express from 'express'
import AdminUseCase from '../../useCase/adminUseCase';
import AdminController from '../../adapters/controllers/adminController';
import GymRepository from '../repository/gymRepository';
import GenerateEmail from '../services/sendEmail';
import JWTToken from '../services/generateToken';
import UserRepository from '../repository/userRepository';


//services
const generateEmail=new GenerateEmail()
const jwtToken=new JWTToken()


//repositories
const gymRepository=new GymRepository()
const userRepository=new UserRepository()



//usecases

const adminUseCase=new AdminUseCase(gymRepository,generateEmail,jwtToken,userRepository)


//controllers

const adminController=new AdminController(adminUseCase)




const router = express.Router();


router.get('/get_gym_details',(req,res)=>adminController.getGymDetails(req,res))
router.put('/gym_admin_response',(req,res)=>adminController.gymAdminResponse(req,res))
router.patch('/gym_block_action/:id',(req,res)=>adminController.gymBlockAction(req,res))
router.delete('/delete_gym/:id',(req,res)=>adminController.deleteGym(req,res))
router.post('/admin_login',(req,res)=>adminController.adminLogin(req,res))
router.post('/admin_logout',(req,res)=>adminController.adminLogout(req,res))
router.get('/fetch_users',(req,res)=>adminController.fetchUsers(req,res))
router.patch('/update_user/:id',(req,res)=>adminController.updateUser(req,res))

export default router