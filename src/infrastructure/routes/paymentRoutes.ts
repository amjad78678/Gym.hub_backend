import express from "express";
import PaymentController from "../../adapters/controllers/paymentController";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import CartRepository from "../repository/cartRepository";
import SubscriptionRepository from "../repository/subscriptionRepository";
import PaymentRepository from "../repository/paymentRepository";
import CouponRepository from "../repository/couponRepository";
import UserRepository from "../repository/userRepository";



//repositories
const cartRepository = new CartRepository()
const subscriptionRepository = new SubscriptionRepository()
const paymentRepository = new PaymentRepository()
const couponRepository = new CouponRepository()
const userRepository= new UserRepository()

//Use cases
const subscriptionUseCase = new SubscriptionUseCase(cartRepository,paymentRepository,subscriptionRepository,couponRepository,userRepository)

//controllers
const paymentController = new PaymentController(subscriptionUseCase,userRepository);



const router = express.Router();

router.post('/webhook',express.raw({type:'application/json'}), (req,res)=> paymentController.confirmPayment(req,res))
router.post('/webhook/add_wallet',express.raw({type:'application/json'}), (req,res)=> paymentController.addWalletPayment(req,res))

export default router