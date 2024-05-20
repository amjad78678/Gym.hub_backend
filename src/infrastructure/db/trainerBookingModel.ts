import mongoose, { Model, Schema } from "mongoose";
import iTrainerBooking from "../../domain/trainerBooking";

 


 const trainerBookingSchema: Schema = new Schema< iTrainerBooking |Document>({

    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    trainerId: { type: Schema.Types.ObjectId, required: true, ref: "Trainer" },
    bookingDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    bookingType: { type: String, enum: {
        values: ["Monthly", "Yearly"],
    } },
    amount: { type: Number, required: true },
    
 }, {
    timestamps: true,
 })


 const TrainerBookingModel: Model<iTrainerBooking | Document> = mongoose.model<iTrainerBooking | Document>("TrainerBooking", trainerBookingSchema); 

 export default TrainerBookingModel