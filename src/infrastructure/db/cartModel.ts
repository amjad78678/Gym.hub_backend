import mongoose, { ObjectId, Schema, Document, Model } from "mongoose";
import Cart from "../../domain/cart";



const CartSchema: Schema = new Schema<Cart | Document>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    gymId: { type: Schema.Types.ObjectId, required: true, ref: "Gym" },
    date: { type: String, required: true },
    expiryDate: { type: String, required: true },
    subscriptionType: { type: String, enum: {
        values: ["Daily", "Monthly", "Yearly"],
    } },
    amount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
}, {
    timestamps: true,
});



const CartModel:Model<Cart | Document> = mongoose.model<Cart | Document>("Cart", CartSchema);

export default CartModel;
