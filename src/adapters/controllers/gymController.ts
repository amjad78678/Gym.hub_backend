import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import SharpImages from "../../infrastructure/services/sharpImages";
import CloudinaryUpload from "../../infrastructure/utils/cloudinaryUpload";
import GymUseCase from "../../useCase/gymUseCase";
import { Request, Response } from "express";

class GymController {
  private _GymUseCase: GymUseCase;
  private _GenerateOtp: GenerateOtp;
  private _GenerateEmail: GenerateEmail;
  private _CloudinaryUpload: CloudinaryUpload;
  private _SharpImages: SharpImages;

  constructor(
    gymUseCase: GymUseCase,
    generateOtp: GenerateOtp,
    generateEmail: GenerateEmail,
    cloudinaryUpload: CloudinaryUpload,
    sharpImages: SharpImages
  ) {
    this._GymUseCase = gymUseCase;
    this._GenerateOtp = generateOtp;
    this._GenerateEmail = generateEmail;
    this._CloudinaryUpload = cloudinaryUpload;
    this._SharpImages = sharpImages;
  }

  async gymRegister(req: Request, res: Response) {
    try {
      console.log("iam req.body", req.body);
      console.log("iam reqfiles", req.files?.length);

      const gym = await this._GymUseCase.gymSignUp(req.body, req.files);
      if (gym) {
        if (gym?.data.status == true) {
          req.app.locals.gymData = gym.data.gymData;
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
    }
  }

  async gymLogin(req: Request, res: Response) {
    try {
      const gym = await this._GymUseCase.gymLogin(req.body);

      console.log("iam gym", gym);
      if (gym) {
        if (gym.data.token != "") {
          console.log("iam Undu ivde", gym.data.token);

          res.cookie("gymJWT", gym.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "none",
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
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.cookie("gymJWT", "", {
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
    }
  }

  async editGymSubscription(req: Request, res: Response) {
    try {
      console.log("iam reqbody", req.body);
      let gymId = req.gymId || "";
      const gym = await this._GymUseCase.editGymSubscription(gymId, req.body);
      res.status(gym.status).json(gym.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async fetchGymSubscription(req: Request, res: Response) {
    try {
      console.log("iamin fetch sub controller", req.params);
      const gymId = req.gymId || "";
      const subscriptions = await this._GymUseCase.fetchGymSubscription(
        gymId as string
      );

      console.log("iam mangatholi", subscriptions.data.message);

      if (subscriptions) {
        res.status(subscriptions.status).json(subscriptions.data.message);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
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
      const otp = this._GenerateOtp.createOtp();
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

  async fetchGymTrainers(req: Request, res: Response) {
    try {
      const gymId = req.gymId || "";
      console.log("iam gymId", gymId);
      const trainers = await this._GymUseCase.fetchGymTrainers(gymId);

      res.status(trainers.status).json(trainers.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async addGymTrainer(req: Request, res: Response) {
    try {
      console.log("iam req.body from addgym", req.body);
      console.log("iam req.file from addgym", req.file, "reqfiels", req.files);
      const gymId = req.gymId || "";
      if (req.file) {
        const image = await this._SharpImages.sharpenImage(
          req.file,
          1500,
          1126,
          "trainers"
        );

        const obj = {
          imageUrl: image.secure_url,
          public_id: image.public_id,
        };
        const trainerData = { ...req.body, image: obj };
        const response = await this._GymUseCase.addGymTrainer(
          gymId,
          trainerData
        );
        res.status(response.status).json(response.data);
      } else {
        const response = await this._GymUseCase.addGymTrainer(gymId, req.body);
        res.status(response.status).json(response.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async updateGymTrainer(req: Request, res: Response) {
    try {
      const trainerId = req.body._id;
      console.log("req.file", req.file);

      if (req.file) {
        const image = await this._SharpImages.sharpenImage(
          req.file,
          1500,
          1126,
          "trainers"
        );
        const trainerData = { ...req.body };
        delete trainerData._id;
        const obj = {
          imageUrl: image.secure_url,
          public_id: image.public_id,
        };
        trainerData.image = obj;
        const response = await this._GymUseCase.updateGymTrainer(
          trainerId,
          trainerData
        );
        res.status(response.status).json(response.data);
      } else {
        const trainerData = { ...req.body };
        delete trainerData._id;

        const response = await this._GymUseCase.updateGymTrainer(
          trainerId,
          trainerData
        );
        res.status(response.status).json(response.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async fetchGymData(req: Request, res: Response) {
    try {
      const gymId = req.gymId || "";
      const response = await this._GymUseCase.fetchGymData(gymId);
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async bookedMemberships(req: Request, res: Response) {
    try {
      const gymId = req.gymId || "";
      console.log("gymsi", gymId);
      const response = await this._GymUseCase.bookedMemberships(gymId);
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async fetchDashboardDetails(req: Request, res: Response) {
    try {
      const gymId = req.gymId || "";
      const response = await this._GymUseCase.fetchDashboardDetails(gymId);
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async editGymProfile(req: Request, res: Response) {
    try {
      const gymId=req.gymId||""
      console.log("iam body", req.body);
     const response= await this._GymUseCase.editGymProfile(gymId,req.body)
     res.status(response.status).json(response.data)
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async editGymImages(req: Request, res: Response) {
    try {
      console.log("reqfiles", req.files);
      console.log(req.body);
      const gymId = req.gymId || "";
      const response = await this._GymUseCase.editGymImages(gymId, req.files);
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }
}

export default GymController;
