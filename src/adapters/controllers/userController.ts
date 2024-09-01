import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import SubscriptionUseCase from "../../useCase/subscriptionUseCase";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

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

  signUp = asyncErrorHandler(async (req: Request, res: Response) => {
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
  });

  userOtpVerification = asyncErrorHandler(
    async (req: Request, res: Response) => {
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
    }
  );

  login = asyncErrorHandler(async (req: Request, res: Response) => {
  
    const user = await this.userUseCase.login(req.body);
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
  });

  resendOtp = asyncErrorHandler(async (req: Request, res: Response) => {
    const otp = this.generateOtp.createOtp();
    req.app.locals.otp = otp;
    this.generateEmail.sendEmail(req.app.locals.userData.email, otp);

    setTimeout(() => {
      req.app.locals.otp = this.generateOtp.createOtp();
    }, 2 * 60000);

    res.status(200).json({ message: "Otp sent successfully" });
  });

  logout = asyncErrorHandler(async (req: Request, res: Response) => {
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
  });

  getGymList = asyncErrorHandler(async (req: Request, res: Response) => {
    const { latitude, longitude, page, search, sliderValue } = req.query;
    const gymList = await this.userUseCase.getGymList(
      latitude,
      longitude,
      parseInt(page as string),
      search as string,
      Number(sliderValue) as number
    );

    res.status(gymList.status).json(gymList.data);
  });

  getGymNormalList = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymList = await this.userUseCase.getGymListNormal();

    res.status(gymList.status).json(gymList.data);
  });

  getGymDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymDetails = await this.userUseCase.getGymDetails(req.params.id);
    res.status(gymDetails.status).json(gymDetails.data);
  });

  getTrainers = asyncErrorHandler(async (req: Request, res: Response) => {
    const { page, search, sliderValue, experience } = req.query;

    const trainers = await this.userUseCase.getTrainers(
      page,
      search as string,
      Number(sliderValue),
      experience
    );
    res.status(trainers.status).json(trainers.data);
  });

  getMaxPriceTrainer = asyncErrorHandler(
    async (req: Request, res: Response) => {
      const response = await this.userUseCase.getMaxPriceTrainer();
      res.status(response.status).json(response.data);
    }
  );

  forgotPassword = asyncErrorHandler(async (req: Request, res: Response) => {
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
  });

  verifyForgot = asyncErrorHandler(async (req: Request, res: Response) => {
    const { forgotOtp } = req.app.locals;
    const { otp } = req.body;

    if (forgotOtp === otp) {
      res.status(200).json({ message: "Otp verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid Otp" });
    }
  });

  updatePassword = asyncErrorHandler(async (req: Request, res: Response) => {
    const forgotEmail = req.app.locals.forgotEmail;
    const password = req.body.password;

    const result = await this.userUseCase.updatePassword(forgotEmail, password);

    if (result) {
      req.app.locals.otp = null;
      req.app.locals.forgotEmail = null;
      res.status(result.status).json(result.data);
    }
  });

  resendForgotOtp = asyncErrorHandler(async (req: Request, res: Response) => {
    const otp = this.generateOtp.createOtp();
    req.app.locals.forgotOtp = otp;
    setTimeout(() => {
      req.app.locals.forgotOtp = this.generateOtp.createOtp();
    }, 2 * 60000);

    this.generateEmail.sendEmail(req.app.locals.forgotEmail, otp);

    res.status(200).json({ message: "Otp sent successfully" });
  });

  getUserDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const userData = await this.userUseCase.getUserDetails(userId);
    res.status(userData.status).json(userData.data);
  });

  addMoneyToWallet = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";

    const body = { ...req.body, userId };

    req.app.locals.walletData = body;

    const result = await this.userUseCase.addMoneyToWallet(body);
    return res.status(result.status).json(result.data);
  });

  getSubscription = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const subscriptionData =
      await this._SubscriptionCase.fetchSubscriptions(userId);
    res.status(subscriptionData.status).json(subscriptionData.data);
  });

  getBookedTrainers = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const trainerData = await this.userUseCase.getBookedTrainers(userId);
    res.status(trainerData.status).json(trainerData.data);
  });

  getTrainerDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainerId = req.params.trainerId;
    const trainerData = await this.userUseCase.getTrainerDetails(trainerId);
    res.status(trainerData.status).json(trainerData.data);
  });

  editProfile = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const body = req.body;
    const userData = await this.userUseCase.editProfile(userId, body, req.file);
    res.status(userData.status).json(userData.data);
  });

  isReviewPossible = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const { gymId } = req.params;
    const result = await this.userUseCase.isReviewPossible(userId, gymId);
    res.status(result.status).json(result.data);
  });

  addGymReview = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const body = req.body;
    const result = await this.userUseCase.addGymReview(userId, body);
    res.status(result.status).json(result.data);
  });

  getGymReviews = asyncErrorHandler(async (req: Request, res: Response) => {
    const { gymId } = req.params;
    const result = await this.userUseCase.getGymReviews(gymId);
    res.status(result.status).json(result.data);
  });

  updateRatingGym = asyncErrorHandler(async (req: Request, res: Response) => {
    const { userReviewId } = req.body;
    const body = { ...req.body };
    delete body.userReviewId;
    const result = await this.userUseCase.updateRatingGym(body, userReviewId);
    res.status(result.status).json(result.data);
  });

  getWorkoutsList = asyncErrorHandler(async (req: Request, res: Response) => {
    const result = await this.userUseCase.getWorkoutsList();
    res.status(result.status).json(result.data);
  });

  getExercisesDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const { body } = req.params;
    const result = await this.userUseCase.getExercisesDetails(body);
    res.status(result.status).json(result.data);
  });

  getMaxPriceGym = asyncErrorHandler(async (req: Request, res: Response) => {
    const response = await this.userUseCase.getMaxPriceGym();
    res.status(response.status).json(response.data);
  });

  setBrowserToken = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.userId || "";
    const browserToken = req.body.token;
    const response = await this.userUseCase.setBrowserToken(
      userId as string,
      browserToken as string
    );
    res.status(response.status).json(response.data);
  });

  sendChatbotMessage = asyncErrorHandler(async (req: Request, res: Response) => {
    const result = await this.userUseCase.chatWithBot(req.body.message);
    res.status(result.status).json(result.data);
  });
}

export default UserController;
