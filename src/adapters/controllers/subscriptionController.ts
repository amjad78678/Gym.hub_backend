import { Request, Response } from "express";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import CouponUseCase from "../../useCase/couponUseCase";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class SubscriptionController {
  private _SubscriptionCase: SubscriptionUseCase;
  private _CouponUseCase: CouponUseCase;

  constructor(
    subscriptionCase: SubscriptionUseCase,
    couponUseCase: CouponUseCase
  ) {
    this._SubscriptionCase = subscriptionCase;
    this._CouponUseCase = couponUseCase;
  }

  addNewSubscription = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";

    const data = { ...req.body, userId: userId };

    if (req.body.paymentType === "online") {
      const result = await this._SubscriptionCase.verifyOnlinePayment(
        data.userId,
        data.gymId,
        data.price
      );
      req.app.locals.paymentDataUser = data;
      res.status(result.status).json(result.data);
    } else {
      const result = await this._SubscriptionCase.addNewSubscription(data);
      res.status(result.status).json(result.data);
    }
  });
}

export default SubscriptionController;
