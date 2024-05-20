import mongoose, { Schema, Document, Model } from "mongoose";
import iChat from "../../domain/chat";
import iMessage from "../../domain/message";

const MessageShema: Schema = new Schema<iMessage & Document>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<iMessage & Document> = mongoose.model<
  iMessage & Document
>("Message", MessageShema);

export default MessageModel;
