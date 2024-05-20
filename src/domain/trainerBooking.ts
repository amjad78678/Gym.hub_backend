import { ObjectId } from "mongoose";

interface iTrainerBooking {
    _id?: string,
    userId: ObjectId,
    trainerId: ObjectId,
    bookingDate: Date,
    expiryDate: Date,
    bookingType: 'Monthly' | 'Yearly',
    amount: number,
}

export default iTrainerBooking