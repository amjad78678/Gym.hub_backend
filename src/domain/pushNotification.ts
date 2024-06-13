import { ObjectId } from "mongoose";

interface iPushNotification { 
    userId: ObjectId;
    token: string;
}

export default iPushNotification