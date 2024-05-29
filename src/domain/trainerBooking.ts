import { ObjectId } from "mongoose";

interface iTrainerBooking {
    _id?: ObjectId | string,
    userId: ObjectId,
    trainerId: ObjectId,
    bookingDate: Date,
    expiryDate: Date,
    bookingType: 'Monthly' | 'Yearly',
    amount: number,
    createdAt?: Date,
    updatedAt?: Date
}

export default iTrainerBooking