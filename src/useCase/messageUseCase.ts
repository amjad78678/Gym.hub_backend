import MessageRepository from "../infrastructure/repository/messageRepository";
import CloudinaryUpload from "../infrastructure/utils/cloudinaryUpload";
import iMessageTrainer from "./interface/messageTrainer";
import PushNotificationRepository from "../infrastructure/repository/pushNotificationRepository";

class MessageUseCase {
  private _MessageRepository: MessageRepository;
  private _CloudinaryUpload: CloudinaryUpload;
  private _PushNotificationRepo: PushNotificationRepository;

  constructor(
    messageRepository: MessageRepository,
    cloudinaryUpload: CloudinaryUpload,
    pushNotificationRepo: PushNotificationRepository
  ) {
    this._MessageRepository = messageRepository;
    this._CloudinaryUpload = cloudinaryUpload;
    this._PushNotificationRepo = pushNotificationRepo;
  }

  async createMessage(data: iMessageTrainer) {
    const messageData: iMessageTrainer =
      await this._MessageRepository.createMessage(data);
    await this._PushNotificationRepo.sendPushNotification(
      data.receiver,
      data.content
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Message sent successfully",
        messageData: messageData,
      },
    };
  }

  async getMessages(trainerId: string) {
    const messageData: iMessageTrainer[] =
      await this._MessageRepository.findTrainerAllMessages(trainerId);

    return {
      status: 200,
      data: {
        success: true,
        message: "Messages fetched successfully",
        messageData: messageData,
      },
    };
  }

  async getConversationData(sender: string, receiver: string) {
    const messageData: iMessageTrainer[] =
      await this._MessageRepository.findMessagesBySenderAndReceiver(
        sender,
        receiver
      );
    return {
      status: 200,
      data: {
        conversations: messageData,
      },
    };
  }

  async uploadChatFiles(files: any, data: any) {
    let fileUploadCloudinary: any;
    let videoFiles = files.filter((file: any) => file.mimetype === "video/mp4");
    if (videoFiles.length > 1) {
      return {
        status: 400,
        data: {
          success: false,
          message: "Only one video file is allowed",
        },
      };
    }

    if (videoFiles.length === 1) {
      fileUploadCloudinary = await this._CloudinaryUpload.uploadVideo(
        videoFiles[0].path,
        "chat-videos"
      );

      const messageData = await this._MessageRepository.createMessage({
        sender: data.sender,
        receiver: data.receiver,
        content: fileUploadCloudinary.secure_url,
      });
      console.log("createdMessageData", messageData);

      return {
        status: 200,
        data: {
          success: true,
          type: "video",
          message: "message sent successfully",
          messageData: messageData,
        },
      };
    } else {
      fileUploadCloudinary = await Promise.all(
        files.map(async (file: any) => {
          return await this._CloudinaryUpload.upload(file.path, "chat");
        })
      );

      console.log("fileUploadCloudinary", fileUploadCloudinary);
      console.log("data message", data);

      const messageDataPromises = fileUploadCloudinary.map(
        async (file: any) => {
          const messageData = await this._MessageRepository.createMessage({
            sender: data.sender,
            receiver: data.receiver,
            content: file.secure_url,
          });
          console.log("createdMessageData", messageData);
          return messageData;
        }
      );

      const messageDataResults = await Promise.all(messageDataPromises);

      console.log("aim messageData results........", messageDataResults);

      return {
        status: 200,
        data: {
          success: true,
          type: "image",
          message: "message sent successfully",
          messageData: messageDataResults,
        },
      };
    }
  }
}

export default MessageUseCase;
