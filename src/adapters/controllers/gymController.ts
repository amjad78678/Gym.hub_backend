import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import GymUseCase from "../../useCase/gymUseCase";
import { Request, Response } from "express";

class GymController {
  private _GymUseCase: GymUseCase;
  private _GenerateOtp: GenerateOtp;
  private _GenerateEmail: GenerateEmail;

  constructor(gymUseCase: GymUseCase , generateOtp: GenerateOtp, generateEmail: GenerateEmail) {
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

      }else{

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
      if(req.body.otp===req.app.locals.otp){
          const gym=await this._GymUseCase.gymOtpVerification(req.app.locals.gymData)
          if(gym.data.status==true){


            req.app.locals.gymData=null
            req.app.locals.otp=null
            res.status(gym.status).json(gym.data)

          }

       }else{
        res.status(400).json({status:false,message:'Invalid Otp'})
       }
   }catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
       
  };


  async resendOtp(req: Request,res: Response){
    try {
      
      const otp=this._GenerateOtp.createOtp()
      req.app.locals.otp=otp
      this._GenerateEmail.sendEmail(req.app.locals.gymData.email,otp)
      console.log(otp)

      setTimeout(() => {
        req.app.locals.otp = this._GenerateOtp.createOtp();
    }, 2 * 60000);

    res.status(200).json({message:'Otp sented successfully'})  

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