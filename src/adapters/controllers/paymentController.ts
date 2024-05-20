import { Request, Response } from "express";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import UserRepository from "../../infrastructure/repository/userRepository";
import UserUseCase from "../../useCase/userUseCase";
import BookTrainerUseCase from "../../useCase/bookTrainerUseCase";

class PaymentController {
  private _SubscriptionUseCase: SubscriptionUseCase;
  private _UserRepository: UserRepository;
  private _BookTrainerUseCase: BookTrainerUseCase


  constructor(subscriptionCase: SubscriptionUseCase, userRepository: UserRepository,bookTrainerUseCase: BookTrainerUseCase) {
    this._SubscriptionUseCase = subscriptionCase;
    this._UserRepository = userRepository;
    this._BookTrainerUseCase = bookTrainerUseCase
  }  

  async confirmPayment(req: Request, res: Response) {
    let event = req.body;

    if (event.type === "checkout.session.completed") {
      const paymentDataUser = req.app.locals.paymentDataUser;

      console.log("paymentData user", paymentDataUser);
      if (paymentDataUser != null) {
        await this._SubscriptionUseCase.addNewSubscription(paymentDataUser);
        req.app.locals.paymentDataUser = null;
      }

      res.status(200).json({ success: true });
    }
  }

  async addWalletPayment(req: Request, res: Response) {
    let event = req.body;

    if (event.type === "checkout.session.completed") {
      const walletData = req.app.locals.walletData;
      const user = await this._UserRepository.findById(walletData.userId);
      if (user) {
        user.wallet = (user.wallet || 0) + walletData.wallet;
        user.walletHistory.push(walletData.walletHistory);

        await this._UserRepository.save(user);

        req.app.locals.walletData = null;

        res.status(200).json({ success: true });
      }
    }
  }

  async bookTrainerPayment(req: Request, res: Response) {
    let event = req.body; 
    if(event.type === "checkout.session.completed"){

      const bookTrainerData = req.app.locals.bookTrainerData
      await this._BookTrainerUseCase.confirmBooking(bookTrainerData)
      req.app.locals.bookTrainerData = null
    }
  }
}

export default PaymentController;
