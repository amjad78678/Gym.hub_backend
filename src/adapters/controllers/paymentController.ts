import { Request, Response } from 'express';
import SubscriptionUseCase from '../../useCase/subscriptionUseCase';




class PaymentController {
   
    private _subscriptionUseCase: SubscriptionUseCase

    constructor(subscriptionCase: SubscriptionUseCase) {
         this._subscriptionUseCase = subscriptionCase
    }


   

    async confirmPayment(req: Request, res: Response) {
        
        let event = req.body
        console.log('Iam in confirm payment',req.body)

        if(event.type === "checkout.session.completed"){
            const paymentDataUser = req.app.locals.paymentDataUser

            if(paymentDataUser != null){
                await this._subscriptionUseCase.addNewSubscription(paymentDataUser)
                req.app.locals.paymentDataUser = null
            }

            res.status(200).json({ success: true })
            
        }




    }

}

export default PaymentController