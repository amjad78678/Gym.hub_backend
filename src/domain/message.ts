import { ObjectId } from "mongoose";

interface iMessage {
  sender: ObjectId; 
  content: string;
  receiver: ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}

export default iMessage