import mongoose, { ObjectId, Schema, Document, Model } from "mongoose";
import Banner from "../../domain/banner";

const BannerSchema: Schema = new Schema<Banner | Document>(
  {
    bannerImage: {
      imageUrl: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const BannerModel: Model<Banner | Document> = mongoose.model< Banner | Document>(
  "Banner",
  BannerSchema
);

export default BannerModel;
