

import mongoose, { Schema, Document, Model } from "mongoose";
import iGymReviews from "../../domain/gymReviews";

const gymReviewsSchema: Schema = new Schema<iGymReviews & Document>(
    {
      userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      gymId:{
        type: Schema.Types.ObjectId,
        ref: "Gym",
        required: true,
      },
      title:{
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      rating: {
       type: Number,
       required: true,
      }
    },
  {
    timestamps: true,
  }
);

const gymReviewsModel: Model<iGymReviews & Document> = mongoose.model<iGymReviews & Document>(
  "GymReviews",
  gymReviewsSchema
);

export default gymReviewsModel;
