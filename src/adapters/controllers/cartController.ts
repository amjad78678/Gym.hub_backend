import { Request, Response } from "express";
import CartUseCase from "../../useCase/cartUseCase";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class CartController {
  private _CartUseCase: CartUseCase;

  constructor(cartUseCase: CartUseCase) {
    this._CartUseCase = cartUseCase;
  }

  addToCart = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const data = { ...req.body, userId };
    const result = await this._CartUseCase.addToCart(data);
    res.status(result.status).json(result.data);
  });

  getCheckoutDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const result = await this._CartUseCase.getCheckoutDetails(userId);
    res.status(result.status).json(result.data);
  });
}

export default CartController;
