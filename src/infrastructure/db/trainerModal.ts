import mongoose, { Model, Schema, Document } from "mongoose";
import Trainer from "../../domain/trainer";

const trainerSchema: Schema = new Schema<Trainer | Document>(
  {
    gymId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Gym",
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    image: {
      imageUrl: {
        type: String,
        default:
          "https://imgs.search.brave.com/hNMAtjnevC5eE2ATUwsjo--1usL5gaNyunR2ID_epOo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtMDAuaWNvbmR1/Y2suY29tL2Fzc2V0/cy4wMC9wcm9maWxl/LWNpcmNsZS1pY29u/LTI1NngyNTYtY205/MWdxbTIucG5n",
      },
      public_id: {
        type: String,
      },
    },
    experience: {
      type: Number,
      required: true,
    },
    achievements: {
      type: String,
      required: true,
    },
    monthlyFee: {
      type: Number,
      required: true,
    },
    yearlyFee: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TrainerModel: Model<Trainer & Document> = mongoose.model<
  Trainer & Document
>("Trainer", trainerSchema);

export default TrainerModel;
