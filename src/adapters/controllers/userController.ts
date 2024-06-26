import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import asyncHandler from "express-async-handler";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";

declare module "express-session" {
  interface SessionData {
    forgotEmail: string | null;
    forgotOtp: number | null;
  }
}

class UserController {
  private userUseCase: UserUseCase;
  private generateOtp: GenerateOtp;
  private generateEmail: GenerateEmail;
  private _SubscriptionCase: SubscriptionUseCase;

  constructor(
    userUseCase: UserUseCase,
    generateOtp: GenerateOtp,
    generateEmail: GenerateEmail,
    subscriptionCase: SubscriptionUseCase
  ) {
    this.userUseCase = userUseCase;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
    this._SubscriptionCase = subscriptionCase;
  }

  async signUp(req: Request, res: Response) {
    try {
      const verifyUser = await this.userUseCase.signUp(req.body.email);
      if (verifyUser.data.status == true && req.body.isGoogle) {
        const user = await this.userUseCase.verifyOtpUser(req.body);
        if (user.data.token != "" && user.data.refreshToken != "") {
          res
            .cookie("user_access_token", user.data.token, {
              httpOnly: true,
              sameSite: "none",
              secure: process.env.NODE_ENV !== "development",
              maxAge: 60 * 60 * 1000,
            })
            .cookie("user_refresh_token", user.data.refreshToken, {
              httpOnly: true,
              sameSite: "none",
              secure: process.env.NODE_ENV !== "development",
              maxAge: 30 * 24 * 60 * 60 * 1000,
            });
        }
        res.status(user.status).json(user.data);
      } else if (verifyUser.data.status == true) {
        req.app.locals.userData = req.body;
        const otp = this.generateOtp.createOtp();
        req.app.locals.otp = otp;
        this.generateEmail.sendEmail(req.body.email, otp);

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
    }
  }

  async userOtpVerification(req: Request, res: Response) {
    try {
      if (req.body.otp === req.app.locals.otp) {
        const user = await this.userUseCase.verifyOtpUser(
          req.app.locals.userData
        );
        req.app.locals.userData = null;
        req.app.locals.otp = null;
        res.status(user.status).json(user.data);
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

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userUseCase.login(email, password);
      if (user.data.token != "" && user.data.refreshToken != "") {
        res
          .cookie("user_access_token", user.data.token, {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 1000,
          })
          .cookie("user_refresh_token", user.data.refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
      }

      res.status(user.status).json(user.data);
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
      const otp = this.generateOtp.createOtp();
      req.app.locals.otp = otp;
      this.generateEmail.sendEmail(req.app.locals.userData.email, otp);

      setTimeout(() => {
        req.app.locals.otp = this.generateOtp.createOtp();
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

  async logout(req: Request, res: Response) {
    try {
      res
        .cookie("user_access_token", "", {
          httpOnly: true,
          expires: new Date(0),
        })
        .cookie("user_refresh_token", "", {
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

  async getGymList(req: Request, res: Response) {
    try {
      const { latitude, longitude, page, search, sliderValue } = req.query;
      const gymList = await this.userUseCase.getGymList(
        latitude,
        longitude,
        parseInt(page as string),
        search as string,
        Number(sliderValue) as number
      );

      res.status(gymList.status).json(gymList.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getGymNormalList(req: Request, res: Response) {
    try {
      const gymList = await this.userUseCase.getGymListNormal();

      res.status(gymList.status).json(gymList.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getGymDetails(req: Request, res: Response) {
    try {
      const gymDetails = await this.userUseCase.getGymDetails(req.params.id);
      res.status(gymDetails.status).json(gymDetails.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getTrainers(req: Request, res: Response) {
    try {
      const { page, search, sliderValue, experience } = req.query;

      const trainers = await this.userUseCase.getTrainers(
        page,
        search as string,
        Number(sliderValue),
        experience
      );
      res.status(trainers.status).json(trainers.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getMaxPriceTrainer(req: Request, res: Response) {
    try {
      const response = await this.userUseCase.getMaxPriceTrainer();
      res.status(response.status).json(response.data);
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

      const result = await this.userUseCase.forgotPassword(email);
      if (result.data.success) {
        req.app.locals.forgotEmail = email;
        const otp = this.generateOtp.createOtp();

        req.app.locals.forgotOtp = otp;
        setTimeout(() => {
          req.app.locals.forgotOtp = this.generateOtp.createOtp();
        }, 2 * 60000);

        this.generateEmail.sendEmail(email, otp);
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async verifyForgot(req: Request, res: Response) {
    try {
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
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const forgotEmail = req.app.locals.forgotEmail;
      const password = req.body.password;

      const result = await this.userUseCase.updatePassword(
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
    }
  }

  async resendForgotOtp(req: Request, res: Response) {
    try {
      const otp = this.generateOtp.createOtp();
      req.app.locals.forgotOtp = otp;
      setTimeout(() => {
        req.app.locals.forgotOtp = this.generateOtp.createOtp();
      }, 2 * 60000);

      this.generateEmail.sendEmail(req.app.locals.forgotEmail, otp);

      res.status(200).json({ message: "Otp sent successfully" });
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getUserDetails(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const userData = await this.userUseCase.getUserDetails(userId);
      res.status(userData.status).json(userData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async addMoneyToWallet(req: Request, res: Response) {
    try {
      const userId = req.userId || "";

      const body = { ...req.body, userId };

      req.app.locals.walletData = body;

      const result = await this.userUseCase.addMoneyToWallet(body);
      return res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getSubscription(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const subscriptionData =
        await this._SubscriptionCase.fetchSubscriptions(userId);
      res.status(subscriptionData.status).json(subscriptionData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getBookedTrainers(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const trainerData = await this.userUseCase.getBookedTrainers(userId);
      res.status(trainerData.status).json(trainerData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getTrainerDetails(req: Request, res: Response) {
    try {
      const trainerId = req.params.trainerId;
      const trainerData = await this.userUseCase.getTrainerDetails(trainerId);
      res.status(trainerData.status).json(trainerData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async editProfile(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const body = req.body;
      const userData = await this.userUseCase.editProfile(
        userId,
        body,
        req.file
      );
      res.status(userData.status).json(userData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async isReviewPossible(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const { gymId } = req.params;
      const result = await this.userUseCase.isReviewPossible(userId, gymId);
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async addGymReview(req: Request, res: Response) {
    try {
      const userId = req.userId || "";
      const body = req.body;
      const result = await this.userUseCase.addGymReview(userId, body);
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getGymReviews(req: Request, res: Response) {
    try {
      const { gymId } = req.params;
      const result = await this.userUseCase.getGymReviews(gymId);
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async updateRatingGym(req: Request, res: Response) {
    try {
      const { userReviewId } = req.body;
      const body = { ...req.body };
      delete body.userReviewId;
      const result = await this.userUseCase.updateRatingGym(body, userReviewId);
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getWorkoutsList(req: Request, res: Response) {
    try {
      const result = await this.userUseCase.getWorkoutsList();
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getExercisesDetails(req: Request, res: Response) {
    try {
      const { body } = req.params;
      const result = await this.userUseCase.getExercisesDetails(body);
      res.status(result.status).json(result.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async getMaxPriceGym(req: Request, res: Response) {
    try {
      const response = await this.userUseCase.getMaxPriceGym();
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async setBrowserToken(req: Request, res: Response) {
  
    try {
      const userId = req.userId || "";
      const browserToken = req.body.token;
      const response = await this.userUseCase.setBrowserToken(
        userId as string,
        browserToken as string
      );
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

export default UserController;
