import { Request, Response } from "express";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import CouponUseCase from "../../useCase/couponUseCase";

class SubscriptionController {

    private _SubscriptionCase: SubscriptionUseCase
    private _CouponUseCase: CouponUseCase
    


constructor (subscriptionCase: SubscriptionUseCase,couponUseCase: CouponUseCase) {

    this._SubscriptionCase = subscriptionCase
    this._CouponUseCase = couponUseCase
}

async addNewSubscription(req: Request, res: Response) {
    try {
        
        const userId = req.userId || ""
 
        const data = {...req.body,userId:userId }



        if(req.body.paymentType === "online"){
            const result = await this._SubscriptionCase.verifyOnlinePayment(data.userId,data.gymId,data.price)
            req.app.locals.paymentDataUser = data
            res.status(result.status).json(result.data);
        }else{

            const result = await this._SubscriptionCase.addNewSubscription(data)
            res.status(result.status).json(result.data);
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