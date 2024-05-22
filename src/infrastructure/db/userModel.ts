import mongoose, { Model, Schema, Document } from "mongoose";
import User from "../../domain/user";

const userSchema: Schema = new Schema<User | Document>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    age: {
      type: Number,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    walletHistory: [
      {
        date: { type: Date },
        amount: { type: Number },
        description: { type: String },
      },
    ],
    profilePic: {
      imageUrl: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png",
      },

      public_id: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const UserModel: Model<User & Document> = mongoose.model<User & Document>(
  "User",
  userSchema
);

export default UserModel;
