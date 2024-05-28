import MessageRepository from "../infrastructure/repository/messageRepository";
import iMessageTrainer from "./interface/messageTrainer";

class MessageUseCase {
  private _MessageRepository: MessageRepository;

  constructor(messageRepository: MessageRepository) {
    this._MessageRepository = messageRepository;
  }

  async createMessage(data: iMessageTrainer) {
    const messageData: iMessageTrainer = await this._MessageRepository.createMessage(data)

    return {
      status: 200,
      data: {
        success: true,
        message: "Message sent successfully",
        messageData: messageData,
      }
    }
  }

  async getMessages(trainerId: string) {
    const messageData: iMessageTrainer[] = await this._MessageRepository.findTrainerAllMessages(trainerId)

    return {
      status: 200,
      data: {
        success: true,
        message: "Messages fetched successfully",
        messageData: messageData,
      }
    }
  }


  async getConversationData(sender: string, receiver: string) {

    const messageData: iMessageTrainer[] = await this._MessageRepository.findMessagesBySenderAndReceiver(sender,receiver)
    return {
      status: 200,
      data:{
        conversations: messageData
      }
    }

  }
}

export default MessageUseCase;
