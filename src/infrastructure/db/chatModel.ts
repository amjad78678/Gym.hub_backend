import mongoose, { Schema, Document, Model } from "mongoose";
import iChat from "../../domain/chat";

const ChatSchema: Schema = new Schema<iChat & Document>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
    //   chatName
    //   isGroupChat
    //   users
    //   latestMessage
    //   groupAdmin
  },
  {
    timestamps: true,
  }
);

const ChatModel: Model<iChat & Document> = mongoose.model<iChat & Document>(
  "Chat",
  ChatSchema
);

export default ChatModel;
