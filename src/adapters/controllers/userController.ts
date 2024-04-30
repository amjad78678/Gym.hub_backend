import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import asyncHandler from "express-async-handler";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";



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

      if(verifyUser.data.status==true &&  req.body.isGoogle){
        const user=await this.userUseCase.verifyOtpUser(req.body)
        res.status(user.status).json(user.data)
      }
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
            req.app.locals.otp=null
            res.status(user.status).json(user.data)
        }else{
          res.status(400).json({status:false,message:'Invalid Otp'})
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

  async login(req: Request, res: Response) {
      
    try {
        
       const {email,password}=req.body

       const user=await this.userUseCase.login(email,password)

       if(user.data.token!=''){
        res.cookie('userJwt',user.data.token,{
            httpOnly:true,
            sameSite:'none',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
       }

       res.status(user.status).json(user.data)


    } catch (error) {
        const err: Error = error as Error;
        res.status(400).json({
          message: err.message,
          stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
        console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async resendOtp(req: Request,res: Response){

    try {
      
      const otp=this.generateOtp.createOtp()
      req.app.locals.otp=otp
      this.generateEmail.sendEmail(req.app.locals.userData.email,otp)
      console.log(otp)

      setTimeout(() => {
        req.app.locals.otp = this.generateOtp.createOtp();
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

  async logout(req: Request,res: Response){

    try {
      
      res.cookie('userJwt','',{
        httpOnly:true,
        expires: new Date(0),
      })
      res.status(200).json({message:'Logged out successfully'})
      
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }


  async getGymList (req: Request, res: Response) {
    try {
      
      const gymList=await this.userUseCase.getGymList()
      res.status(gymList.status).json(gymList.data)
      
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async getGymDetails (req: Request, res: Response) {
    try {
      
      console.log('hellobro')

      const gymDetails=await this.userUseCase.getGymDetails(req.params.id)
      res.status(gymDetails.status).json(gymDetails.data)

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
