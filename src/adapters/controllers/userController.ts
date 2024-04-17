import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import asyncHandler from "express-async-handler";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";

//it is extended from express session
declare module "express-session" {
  interface SessionData {
    forgotEmail?: string;
    forgotOtp?: number;
    forgotClubEmail?: string;
    forgotClubOtp?: number;
  }
}

class UserController {
  private userUseCase: UserUseCase;
  private generateOtp: GenerateOtp;
  private generateEmail: GenerateEmail;

  constructor(
    userUseCase: UserUseCase,
    generateOtp: GenerateOtp,
    generateEmail: GenerateEmail
  ) {
    this.userUseCase = userUseCase;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
  }

  async signUp(req: Request, res: Response) {
    try {
      console.log("iam body", req.body);

      const verifyUser = await this.userUseCase.signUp(req.body.email);

      if (verifyUser.data.status == true) {
        req.app.locals.userData = req.body;
        const otp = this.generateOtp.createOtp();
        req.app.locals.otp = otp;
        this.generateEmail.sendEmail(req.body.email, otp);
        console.log(otp);

        setTimeout(() => {
          req.app.locals.otp = this.generateOtp.createOtp();
        }, 2 * 60000);

        res.status(verifyUser.status).json(verifyUser.data);
      } else {
        res.status(verifyUser.status).json(verifyUser.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async userOtpVerification(req: Request, res: Response) {
    try {

        if(req.body.otp===req.app.locals.otp){
            const user=await this.userUseCase.verifyOtpUser(req.app.locals.userData)
            req.app.locals.userData=null
            res.status(user.status).json(user.data)
        }

  
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }
}

export default UserController;
