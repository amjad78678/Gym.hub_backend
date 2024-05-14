import { Document, ObjectId } from 'mongoose';

interface Subscription extends Document {
    userId: ObjectId;
    gymId: ObjectId;
    date: string;
    expiryDate: string;
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