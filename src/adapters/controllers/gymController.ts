import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import GymUseCase from "../../useCase/gymUseCase";
import { Request, Response } from "express";

class GymController {
  private _GymUseCase: GymUseCase;
  private _GenerateOtp: GenerateOtp;
  private _GenerateEmail: GenerateEmail;

  constructor(
    gymUseCase: GymUseCase,
    generateOtp: GenerateOtp,
    generateEmail: GenerateEmail
  ) {
    this._GymUseCase = gymUseCase;
    this._GenerateOtp = generateOtp;
    this._GenerateEmail = generateEmail;
  }

  async gymRegister(req: Request, res: Response) {
    try {
      const gym = await this._GymUseCase.gymSignUp(req.body);

      if (gym.data.status == true) {
        req.app.locals.gymData = req.body;
        const otp = this._GenerateOtp.createOtp();
        req.app.locals.otp = otp;
        this._GenerateEmail.sendEmail(req.body.email, otp);
        console.log(otp);

        setTimeout(() => {
          req.app.locals.otp = this._GenerateOtp.createOtp();
        }, 2 * 60000);

        res.status(gym.status).json(gym.data);
      } else {
        res.status(gym.status).json(gym.data);
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

  async gymOtpVerification(req: Request, res: Response) {
    try {
      if (req.body.otp === req.app.locals.otp) {
        const gym = await this._GymUseCase.gymOtpVerification(
          req.app.locals.gymData
        );
        if (gym.data.status == true) {
          req.app.locals.gymData = null;
          req.app.locals.otp = null;
          res.status(gym.status).json(gym.data);
        }
      } else {
        res.status(400).json({ status: false, message: "Invalid Otp" });
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

  async resendOtp(req: Request, res: Response) {
    try {
      const otp = this._GenerateOtp.createOtp();
      req.app.locals.otp = otp;
      this._GenerateEmail.sendEmail(req.app.locals.gymData.email, otp);
      console.log(otp);

      setTimeout(() => {
        req.app.locals.otp = this._GenerateOtp.createOtp();
      }, 2 * 60000);

      res.status(200).json({ message: "Otp sented successfully" });
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async gymLogin(req: Request, res: Response) {
    try { 
      const gym = await this._GymUseCase.gymLogin(req.body);

      if (gym) {
        if (gym.data.token !== "") {
          console.log('iam Undu ivde',gym.data.token)

          res.cookie("gymJwt", gym.data.token, {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
        }

        res.status(gym.status).json(gym.data);
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

  async logout(req: Request, res: Response) {
    try {
      res.cookie("gymJwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,  
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }
  
  async editGymSubscription (req: Request, res: Response) {
    try {
      
       
     let gymId=req.gymId || ""
      const gym = await this._GymUseCase.editGymSubscription(gymId,req.body);

       res.status(gym.status).json(gym.data);


    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,  
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }



   async fetchGymSubscription (req: Request, res: Response) {
     try {
      

    const subscriptions=await this._GymUseCase.fetchGymSubscription(req.gymId as string);
     
    console.log('iam mangatholi',subscriptions.data.message)

    
       if(subscriptions){
        res.status(subscriptions.status).json(subscriptions.data.message) 

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


   async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const result = await this._GymUseCase.forgotPassword(email);
      if (result.data.success) {
        req.app.locals.forgotEmail = email;
        const otp = this._GenerateOtp.createOtp();
        console.log(otp);

        req.app.locals.forgotOtp = otp;
        setTimeout(() => {
          req.app.locals.forgotOtp = this._GenerateOtp.createOtp();
        }, 2 * 60000);

        this._GenerateEmail.sendEmail(email, otp);
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async verifyForgot(req: Request, res: Response) {
    try {
      console.log("bodyotp", req.body.otp);
      console.log("session", req.app.locals.forgotOtp);

      const { forgotOtp } = req.app.locals;
      const { otp } = req.body;

      if (forgotOtp === otp) {
        res.status(200).json({ message: "Otp verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid Otp" });
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

  async updatePassword(req: Request, res: Response) {
    try {
      const forgotEmail = req.app.locals.forgotEmail;
      const password = req.body.password;

      const result = await this._GymUseCase.updatePassword(
        forgotEmail,
        password
      );

      if (result) {
        req.app.locals.otp = null;
        req.app.locals.forgotEmail = null;
        res.status(result.status).json(result.data);
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

  async resendForgotOtp(req: Request, res: Response) {
    try {


      const otp=this._GenerateOtp.createOtp();
      console.log(otp);
      req.app.locals.forgotOtp = otp;
      setTimeout(() => {
        req.app.locals.forgotOtp = this._GenerateOtp.createOtp();
      }, 2 * 60000);

      this._GenerateEmail.sendEmail(req.app.locals.forgotEmail, otp);

     
      res.status(200).json({ message: "Otp sent successfully" });



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

export default GymController;
