import CouponI from "../../domain/coupon";
import CouponRepo from "../../useCase/interface/couponRepo";
import CouponModel from "../db/couponModel";

class CouponRepository implements CouponRepo {
    async save(data: CouponI): Promise<CouponI> {
        const coupon = new CouponModel(data);
       const couponData= await coupon.save();
        return couponData;
    }

    async findByName(name: string): Promise<boolean> {
        try {
            const coupon = await CouponModel.findOne({ name });
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }
    async findByNameData(name: string): Promise<CouponI | null> {
            const coupon = await CouponModel.findOne({ name });
            if (coupon) return coupon;
            return null
    }
    async findAllCoupons(gymId: string): Promise<{}[]> {
        let coupons = await CouponModel.find({gymId: gymId});
        return coupons;
    }
    async findCheckoutCoupons(gymId: string): Promise<{}[]> {
        let coupons = await CouponModel.find({gymId: gymId});
        return coupons;
    }

    async findByNameForEdit(name: string, id: string): Promise<boolean> {
        try {
            const coupon = await CouponModel.findOne({name: name, _id: {$ne: id}});
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }
    async findById(id: string): Promise<any> {
        const coupon = await CouponModel.findOne({ _id: id });
        return coupon;
    }

    async findByIdAndUpdate(id: string, data: any): Promise<any> {
        const coupon = await CouponModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        return coupon;
    }

    async deleteCoupon(id: string): Promise<any> {
        try {
            const deleted = await CouponModel.deleteOne({ _id: id });
            if (deleted) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findByNameForCheckout(name: string): Promise<any> {
        try {
            const coupon = await CouponModel.findOne({ name });
            if (coupon) return coupon;
            return false;
        } catch (error) {
            return false;
        }
    }

    async applyCoupon(userId: string, name: string): Promise<boolean> {
        console.log('userid',userId)
        try {
            const coupon = await CouponModel.updateOne(
                { name },
                { $push: { users: userId } }
            );
            console.log('iamIn repository',coupon)
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findAvailableCoupons(): Promise<{}[]> {
        const currDate = new Date();
        let coupons = await CouponModel.find({
            $and: [
                { startingDate: { $lte: currDate } },
                { endingDate: { $gte: currDate } }
            ]
        });
        return coupons;
    }

}
export default CouponRepository;
