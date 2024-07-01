import { Request, Response } from "express";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import UserRepository from "../../infrastructure/repository/userRepository";
import UserUseCase from "../../useCase/userUseCase";
import BookTrainerUseCase from "../../useCase/bookTrainerUseCase";

class PaymentController {
  private _SubscriptionUseCase: SubscriptionUseCase;
  private _UserRepository: UserRepository;
  private _BookTrainerUseCase: BookTrainerUseCase;

  constructor(
    subscriptionCase: SubscriptionUseCase,
    userRepository: UserRepository,
    bookTrainerUseCase: BookTrainerUseCase
  ) {
    this._SubscriptionUseCase = subscriptionCase;
    this._UserRepository = userRepository;
    this._BookTrainerUseCase = bookTrainerUseCase;
  }

  async confirmPayment(req: Request, res: Response) {
    let event = req.body;
    console.log("i am inside webhook its called there");
    if (event.type === "checkout.session.completed") {
      const paymentDataUser = req.app.locals.paymentDataUser;
      const walletData = req.app.locals.walletData;
      const bookTrainerData = req.app.locals.bookTrainerData;

      console.log("book trainer data", bookTrainerData);
      if (walletData != null) {
        await this._SubscriptionUseCase.addWalletPayment(walletData);
        req.app.locals.walletData = null;
      }

      if (paymentDataUser != null) {
        await this._SubscriptionUseCase.addNewSubscription(paymentDataUser);
        req.app.locals.paymentDataUser = null;
      }

      if (bookTrainerData != null) {
        await this._BookTrainerUseCase.bookTrainerPayment(bookTrainerData);
        req.app.locals.bookTrainerData = null;
      }
    }
    res.status(200).json({ success: true });
  }
}

export default PaymentController;
