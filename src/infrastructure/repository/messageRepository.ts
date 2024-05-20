import iMessageTrainer from "../../useCase/interface/messageTrainer";
import MessageModel from "../db/messageModel";

class MessageRepository {
  async findMessagesBySenderAndReceiver(
    senderId: string,
    receiverId: string
  ): Promise<iMessageTrainer[]> {
    const messageData: iMessageTrainer[] = await MessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    return messageData;
  }

  async createMessage(data: iMessageTrainer): Promise<iMessageTrainer> {
    const message = new MessageModel(data);
    const messageData: iMessageTrainer = await message.save();
    return messageData;
  }

  async findTrainerAllMessages(trainerId: string): Promise<iMessageTrainer[]> {
    const messageData: iMessageTrainer[] = await MessageModel.find({
      receiver: trainerId,
    })
      .populate({ path: "sender", model: "User" })
      .exec();

    console.log("messageData", messageData);
    return messageData;
  }
}

export default MessageRepository;
