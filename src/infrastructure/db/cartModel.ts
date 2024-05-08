import mongoose, { ObjectId, Schema, Document } from "mongoose";
import Cart from "../../domain/cart";



const CartSchema = new Schema<Cart>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    gymId: { type: Schema.Types.ObjectId, required: true, ref: "Gym" },
    date: { type: String, required: true },
    expiryDate: { type: String, required: true },
    subscriptionType: { type: String, enum: {
        values: ["Daily", "Monthly", "Yearly"],
    } },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});



const CartModel = mongoose.model<Cart>("Cart", CartSchema);

export default CartModel;
