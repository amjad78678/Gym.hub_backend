import MessageRepository from "../infrastructure/repository/messageRepository";
import CloudinaryUpload from "../infrastructure/utils/cloudinaryUpload";
import iMessageTrainer from "./interface/messageTrainer";

class MessageUseCase {
  private _MessageRepository: MessageRepository;
  private _CloudinaryUpload: CloudinaryUpload;

  constructor(messageRepository: MessageRepository,cloudinaryUpload: CloudinaryUpload) {
    this._MessageRepository = messageRepository;
    this._CloudinaryUpload = cloudinaryUpload;

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

async uploadChatFiles(files: any,data: any){

const fileUploadCloudinary = await Promise.all(files.map(async(file: any)=>{
  return await this._CloudinaryUpload.upload(file.path,"chat")
}))

  console.log('fileUploadCloudinary',fileUploadCloudinary)
  console.log('data message',data)

  const messageDataPromises = fileUploadCloudinary.map(async (file: any) => {
    const messageData = await this._MessageRepository.createMessage({
      sender: data.sender,
      receiver: data.receiver,
      content: file.secure_url,
    });
    console.log('createdMessageData', messageData);
    return messageData;
  });


  const messageDataResults = await Promise.all(messageDataPromises);

  console.log('aim messageData results........',messageDataResults)

  return {
    status: 200,
    data: {
      success: true,
      message: "message sent successfully",
      messageData: messageDataResults,
    }
  };
  }
}

export default MessageUseCase;
