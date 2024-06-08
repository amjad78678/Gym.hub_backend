import { Request, Response } from "express";
import CouponUseCase from "../../useCase/couponUseCase";

class CouponController {
    private _CouponCase: CouponUseCase;
    constructor(couponCase: CouponUseCase) {
        this._CouponCase = couponCase;
    }

    async addCoupon(req: Request, res: Response) {
        try {
            const gymId = req.gymId || ""
            const upperCaseName=req.body.name.toUpperCase()
            const couponData={
                ...req.body,gymId: gymId,name: upperCaseName}
            const result = await this._CouponCase.addCoupon(couponData);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getAllCoupons(req: Request, res: Response) {
        try {
            const gymId = req.gymId || ""
            const result = await this._CouponCase.findAllCoupons(gymId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async editCoupon(req: Request, res: Response) {
        try {
            const {couponId,name} = req.body
            const nameUpperCase= name.toUpperCase()
            const couponData = {...req.body,name: nameUpperCase}
            delete couponData.couponId;
            const result = await this._CouponCase.editCoupon(couponId,couponData,);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async deleteCoupon(req: Request, res: Response) {
        try {
            const result = await this._CouponCase.deleteCoupon(req.params.id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async validateCoupon (req: Request, res: Response) {
        try {
    
            const userId = req.userId || ""
            const { coupon, price } = req.body;
            const result = await this._CouponCase.couponValidateForCheckout(userId, coupon, price);
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
export default CouponController;
