import { Document, ObjectId } from 'mongoose';

interface Subscription extends Document {
    userId: ObjectId;
    gymId: ObjectId;
    date: Date;
    expiryDate: Date;
    subscriptionType: 'Daily' | 'Monthly' | 'Yearly';
    paymentType: 'online' | 'wallet';
    qrCode?: string;
    coupon?: {
        name: string;
        discount: number;
        isApplied: boolean;
    };
    price: number;
}

export default Subscription