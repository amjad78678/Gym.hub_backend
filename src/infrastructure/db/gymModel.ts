import mongoose, { Model, Schema, Document } from "mongoose";
import Gym from "../../domain/gym";

interface Image {
  imageUrl: string;
  public_id: string;
}

const imageSchema: Schema = new Schema<Image>({
  imageUrl: String,
  public_id: String,
});

const gymSchema: Schema = new Schema<Gym | Document>(
  {
    gymName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    businessId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    location: {
      type: { type: String },
      coordinates: [Number],
    },

    images: [imageSchema],
  },
  { timestamps: true }
);

gymSchema.index({ location: "2dsphere" });

const GymModel = mongoose.model("Gym", gymSchema);

export default GymModel;
