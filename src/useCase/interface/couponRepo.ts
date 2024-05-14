import CouponI from "../../domain/coupon";

interface CouponRepo {
    save(data: CouponI): Promise<CouponI>;
    findByName(name: string): Promise<boolean>;
    findAllCoupons(): Promise<{}[]>;
    findCheckoutCoupons(gymId: string): Promise<{}[]>;
    findByNameForEdit(name: string, id: string): Promise<boolean>;
    findById(id: string): Promise<any>;
    deleteCoupon(id: string): Promise<any>;
    findByNameForCheckout(name: string): Promise<any>;
    applyCoupon(userId: string, name: string): Promise<boolean>;
    findAvailableCoupons(): Promise<{}[]>;
    findByIdAndUpdate(id: string, data: any): Promise<any>;

} 
export default CouponRepo;
