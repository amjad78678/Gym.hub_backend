import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import BookTrainerUseCase from "../../useCase/bookTrainerUseCase";

class BookTrainerController {
  private _BookTrainerUseCase: BookTrainerUseCase;

  constructor(bookTrainerUseCase: BookTrainerUseCase) {
    this._BookTrainerUseCase = bookTrainerUseCase;
  }

  async bookTrainer(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const body = { ...req.body, userId };
      const result = await this._BookTrainerUseCase.verifyTrainerBooking(body);
      req.app.locals.bookTrainerData = body;
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }
}

export default BookTrainerController;
