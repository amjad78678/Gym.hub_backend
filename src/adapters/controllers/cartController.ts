import { Request, Response } from "express";
import CartUseCase from "../../useCase/cartUseCase";

class CartController {
  private _CartUseCase: CartUseCase;

  constructor(cartUseCase: CartUseCase) {
    this._CartUseCase = cartUseCase;
  }

  async addToCart(req: Request, res: Response) {
    try {

        console.log(req.userId)
        console.log('body',req.body)
       const userId= req.userId || ""

       const data = {...req.body,userId:userId}

       const result = await this._CartUseCase.addToCart(data);
       res.status(result.status).json(result.data);
         

    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getCheckoutDetails(req: Request, res: Response) {
      try {
        
        const userId = req.userId || ""
        const result = await this._CartUseCase.getCheckoutDetails(userId);
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

export default CartController;
