import mongoose, { ObjectId, Schema, Document } from "mongoose";
import Subscription from "../../domain/subscription";



const SubscriptionSchema = new Schema<Subscription>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    gymId: { type: Schema.Types.ObjectId, required: true, ref: "Gym" },
    date: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    subscriptionType: { type: String, enum: {
        values: ["Daily", "Monthly", "Yearly"],
    } },
    paymentType: { type: String, enum: {
        values: ["online", "wallet"],
    }},
    price: { type: Number, required: true },
    coupon: {
       name: { type: String },
       discount: { type: Number },
       isApplied: { type: Boolean, default: false },

    },
    qrCode: { type: String },
}, {
    timestamps: true,
});



const SubscriptionModel = mongoose.model<Subscription>("Subscription", SubscriptionSchema);

export default SubscriptionModel;
