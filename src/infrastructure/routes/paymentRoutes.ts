import express from "express";
import PaymentController from "../../adapters/controllers/paymentController";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import CartRepository from "../repository/cartRepository";
import SubscriptionRepository from "../repository/subscriptionRepository";
import PaymentRepository from "../repository/paymentRepository";



//repositories
const cartRepository = new CartRepository()
const subscriptionRepository = new SubscriptionRepository()
const paymentRepository = new PaymentRepository()

//Use cases
const subscriptionUseCase = new SubscriptionUseCase(cartRepository,paymentRepository,subscriptionRepository)

//controllers
const paymentController = new PaymentController(subscriptionUseCase);



const router = express.Router();

router.post('/webhook',express.raw({type:'application/json'}), (req,res)=> paymentController.confirmPayment(req,res))

export default router