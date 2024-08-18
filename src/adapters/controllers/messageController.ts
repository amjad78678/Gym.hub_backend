import iMessageTrainer from "../../useCase/interface/messageTrainer";
import MessageUseCase from "../../useCase/messageUseCase";
import { Request, Response } from "express";
import asyncHandler from "../../infrastructure/utils/asyncErrorHandler";

class MessageController {
  private _MessageUseCase: MessageUseCase;

  constructor(messageUseCase: MessageUseCase) {
    this._MessageUseCase = messageUseCase;
  }

  createMessage = asyncHandler(async (req: Request, res: Response) => {
    const { content, sender, receiver }: iMessageTrainer = req.body;
    const response = await this._MessageUseCase.createMessage({ content, sender, receiver });
    res.status(response.status).json(response.data);
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const trainerId = req.trainerId || "";
    const response = await this._MessageUseCase.getMessages(trainerId);
    return res.status(response.status).json(response.data);
  });

  getConversationData = asyncHandler(async (req: Request, res: Response) => {
    const { sender, receiver } = req.params;
    const response = await this._MessageUseCase.getConversationData(sender, receiver);
    return res.status(response.status).json(response.data);
  });

  uploadChatFiles = asyncHandler(async (req: Request, res: Response) => {
    const response = await this._MessageUseCase.uploadChatFiles(req.files, req.body);
    return res.status(response.status).json(response.data);
  });
}

export default MessageController;
