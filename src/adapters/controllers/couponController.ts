import { Request, Response } from "express";
import CouponUseCase from "../../useCase/couponUseCase";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class CouponController {
  private _CouponCase: CouponUseCase;

  constructor(couponCase: CouponUseCase) {
    this._CouponCase = couponCase;
  }

  addCoupon = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const upperCaseName = req.body.name.toUpperCase();
    const couponData = {
      ...req.body,
      gymId: gymId,
      name: upperCaseName,
    };
    const result = await this._CouponCase.addCoupon(couponData);
    res.status(result.status).json(result.data);
  });

  getAllCoupons = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const result = await this._CouponCase.findAllCoupons(gymId);
    res.status(result.status).json(result.data);
  });

  editCoupon = asyncErrorHandler(async (req: Request, res: Response) => {
    if (req.body.editing === true) {
      const { couponId, name } = req.body;
      const nameUpperCase = name.toUpperCase();
      const couponData = { ...req.body, name: nameUpperCase };
      delete couponData.couponId;
      const result = await this._CouponCase.editCoupon(couponId, couponData);
      res.status(result.status).json(result.data);
    } else {
      const { _id, data } = req.body;
      const result = await this._CouponCase.deleteCoupon(_id, data);
      res.status(result.status).json(result.data);
    }
  });

  validateCoupon = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const { coupon, price } = req.body;
    const result = await this._CouponCase.couponValidateForCheckout(
      userId,
      coupon,
      price
    );
    res.status(result.status).json(result.data);
  });
}

export default CouponController;
