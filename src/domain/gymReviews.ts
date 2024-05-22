import { ObjectId } from "mongoose";

interface iGymReviews {
    userId: ObjectId;
    gymId: ObjectId;
    title: string;
    description: string;
    rating: number;
}

export default iGymReviews