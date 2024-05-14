import { ObjectId } from "mongoose";

interface CouponI {
    id?: string;
    gymId: ObjectId;
    name: string,
    description: string;
    minPrice: number;
    discount: number;
    startingDate: Date;
    endingDate: Date;
    users?: string[];

}
export default CouponI;
