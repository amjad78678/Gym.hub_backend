import mongoose, { Schema, Document, Model } from 'mongoose';
import CouponI from '../../domain/coupon';


const CouponSchema: Schema = new Schema<CouponI & Document>({
    name: { type: String, required: true },
    gymId: { 
        type: Schema.Types.ObjectId,
        ref: 'Gym',
    },
    description: { type: String, required: true },
    discount: { type: Number, required: true },
    minPrice: { type: Number, required: true },
    startingDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    isDelete: { type: Boolean, default: false },
    users: [{ type: String }],
}, {
    timestamps: true
});

const CouponModel: Model<CouponI & Document> = mongoose.model<CouponI & Document>('Coupon', CouponSchema);

export default CouponModel;

