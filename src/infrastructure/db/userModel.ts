import mongoose, { Model, Schema, Document } from "mongoose";
import User from "../../domain/user";

const userSchema: Schema = new Schema<User | Document>({
  username: {
    type: String,
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

  mobileNumber: {
    type: Number,
    required:true
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  age: {
    type: Number,
    required: true
  },
  isBlocked:{
    type: Boolean,
    default: false
  },
  isDeleted:{
    type: Boolean,
    default: false
  },
  isGoogle:{
    type: Boolean,
    default: false
  },
  profilePic:{
    type: String,
    default:
        "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png",
    },
  

},{timestamps:true});

const UserModel: Model<User & Document> = mongoose.model<User & Document>("User",userSchema);

export default UserModel
