import mongoose, { Model, Schema, Document } from "mongoose";
import Trainer from "../../domain/trainer";

const trainerSchema: Schema = new Schema<Trainer | Document>(
  {
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
  experiance: {
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
    required:true

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

const TrainerModel: Model<Trainer & Document> = mongoose.model<Trainer & Document>(
  "Trainer",
  trainerSchema
);

export default TrainerModel;

