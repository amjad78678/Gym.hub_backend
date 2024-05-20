import { ObjectId } from "mongoose";

interface iChat  {
    _id?: string; 
    chatName: string;
    students: ObjectId[];
    latestMessage: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export default iChat