import mongoose, { Schema, Document, Model } from "mongoose";
import iPushNotification from "../../domain/pushNotification";

const PushNotificationSchema: Schema = new Schema<iPushNotification & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: { 
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true,
  }
);

const PushNotificationModel: Model<iPushNotification & Document> =
  mongoose.model<iPushNotification & Document>(
    "PushNotification",
    PushNotificationSchema
  );

export default PushNotificationModel;
