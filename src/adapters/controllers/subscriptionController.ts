import { Request, Response } from "express";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";

class SubscriptionController {

    private _SubscriptionCase: SubscriptionUseCase


constructor (subscriptionCase: SubscriptionUseCase) {

    this._SubscriptionCase = subscriptionCase
}

async addNewSubscription(req: Request, res: Response) {
    try {
        
console.log('newSubscksdjfksjfksdjkfjksj')
        const userId = req.userId || ""
 
        const data = {...req.body,userId:userId }

        console.log('iamdata control',data)

        if(req.body.paymentType === "online"){

            const result = await this._SubscriptionCase.verifyOnlinePayment(data.userId,data.gymId,data.price)
            req.app.locals.paymentDataUser = data
            res.status(result.status).json(result.data);
        }else{
            console.log('iam wallet data')
        }


    } catch (error) {
        const err: Error = error as Error;
        res.status(400).json({
          message: err.message,
          stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
    }
}




}


export default SubscriptionController