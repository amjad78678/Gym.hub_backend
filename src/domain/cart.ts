import { Document, ObjectId } from 'mongoose';

interface Cart extends Document {
    userId: ObjectId;
    gymId: ObjectId;
    date: string;
    expiryDate: string;
    subscriptionType: 'Daily' | 'Monthly' | 'Yearly';
    amount: number;
    totalPrice: number;
}

export default Cart