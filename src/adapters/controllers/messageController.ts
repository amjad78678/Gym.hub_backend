import iMessageTrainer from "../../useCase/interface/messageTrainer";
import MessageUseCase from "../../useCase/messageUseCase";
import { Request, Response } from "express";

class MessageController {
  private _MessageUseCase: MessageUseCase;

  constructor(messageUseCase: MessageUseCase) {
    this._MessageUseCase = messageUseCase;
  }

  async createMessage(req: Request, res: Response) {
    try {
        const {content,sender, receiver }:iMessageTrainer = req.body
        const response = await this._MessageUseCase.createMessage({content,sender,receiver});
        
        res.status(response.status).json(response.data)
        
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getMessages(req: Request, res: Response) {

     try {
        const trainerId = req.trainerId || "";
        const response = await this._MessageUseCase.getMessages(trainerId);
        return res.status(response.status).json(response.data);
     } catch (error) {
        const err: Error = error as Error;
        res.status(400).json({
          message: err.message,
          stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
     }

  }

  async getConversationData (req: Request, res: Response) {

    try {

      const {sender,receiver} = req.params


      const response = await this._MessageUseCase.getConversationData(sender,receiver);
      return res.status(response.status).json(response.data);

      
    } catch (error) {
     const err: Error = error as Error;
     res.status(400).json({
       message: err.message,
       stack: process.env.NODE_ENV === "production" ? null : err.stack,
     });
    }
 
 }
}

export default MessageController;
