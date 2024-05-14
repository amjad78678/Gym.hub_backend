import CouponI from "../domain/coupon";
import CouponRepository from "../infrastructure/repository/couponRepository";

class CouponUseCase {
    private _CouponRepository: CouponRepository;
    constructor(couponRepository: CouponRepository) {
        this._CouponRepository = couponRepository;
    }

    async addCoupon(data: CouponI) {
        const couponExist = await this._CouponRepository.findByName(data.name);
        if (!couponExist) {
            const coupon = await this._CouponRepository.save(data);
            return {
                status: 200,
                data: {
                    message: "Coupon Added Successfully",
                    coupon
                }
            };
        } else {
            return {
                status: 400,
                data: { message: 'Coupon Already Exists!' }
            };
        }

    }

    async findAllCoupons() {
        const coupons = await this._CouponRepository.findAllCoupons();
        return {
            status: 200,
            message: "All Coupons",
            data: {
                coupons
            }
        };
    }

    async editCoupon(couponId: string,data: CouponI) {
        if (couponId) {
            const couponExist = await this._CouponRepository.findByNameForEdit(data.name, couponId);
            if (!couponExist) {
                const coupon: CouponI = await this._CouponRepository.findByIdAndUpdate(couponId,data);
                  
                    return {
                        status: 200,
                        data: {
                            message: "Coupon Updated Successfully",
                            coupon
                        }
                    };
                } 
             else {
                return {
                    status: 400,
                    data: { message: 'Coupon name already exists!' }
                };
            }
        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again!' }
            };
        }
    }

    async deleteCoupon(id: string) {
        const deleted = await this._CouponRepository.deleteCoupon(id);
        if (deleted) {
            return {
                status: 200,
                data: 'Coupon Deleted'
            };
        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again!' }
            };
        }
    }

    async couponValidateForCheckout(userId: string, name: string, price: number) {
        const coupon: CouponI = await this._CouponRepository.findByNameForCheckout(name);
        if (coupon) {
            if ((new Date(coupon.startingDate) > new Date()) || (new Date() > new Date(coupon.endingDate))) {
                return {
                    status: 400,
                    data: { message: 'Coupon expired!' }
                };
            }
            else if (coupon.users && coupon.users.includes(userId)) {
                return {
                    status: 400,
                    data: { message: 'Coupon already used!' }
                };
            } else if (price < coupon.minPrice) {
                return {
                    status: 400,
                    data: { message: `Minimum purchase should be ₹${coupon.minPrice}` }
                };
            } else {
                return {
                    status: 200,
                    data: {
                        message: 'Coupon Validated Successfully',
                        coupon
                    }
                };
            }
        } else {
            return {
                status: 400,
                data: { message: "Coupon doesn't exist!" }
            };
        }
    }
}
export default CouponUseCase;
