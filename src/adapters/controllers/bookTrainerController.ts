import { Request, Response } from "express";
import BookTrainerUseCase from "../../useCase/bookTrainerUseCase";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class BookTrainerController {
  private _BookTrainerUseCase: BookTrainerUseCase;

  constructor(bookTrainerUseCase: BookTrainerUseCase) {
    this._BookTrainerUseCase = bookTrainerUseCase;
  }

  bookTrainer = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const body = { ...req.body, userId };
    const result = await this._BookTrainerUseCase.verifyTrainerBooking(body);
    req.app.locals.bookTrainerData = body;
    res.status(result.status).json(result.data);
  });
}

export default BookTrainerController;
