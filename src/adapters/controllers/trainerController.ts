import { Request, Response } from "express";
import TrainerUseCase from "../../useCase/trainerUseCase";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class TrainerController {
  private _TrainerUseCase: TrainerUseCase;
  private _GenerateOtp: GenerateOtp;
  private _GenerateEmail: GenerateEmail;

  constructor(
    trainerUseCase: TrainerUseCase,
    generateOtp: GenerateOtp,
    generateEmail: GenerateEmail
  ) {
    this._TrainerUseCase = trainerUseCase;
    this._GenerateOtp = generateOtp;
    this._GenerateEmail = generateEmail;
  }

  login = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const trainerData = await this._TrainerUseCase.login(email, password);

    if (trainerData?.data?.token) {
      res.cookie("trainerJWT", trainerData.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    res.status(trainerData.status).json(trainerData.data);
  });

  logout = asyncErrorHandler(async (req: Request, res: Response) => {
    res.cookie("trainerJWT", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  });

  forgotPassword = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await this._TrainerUseCase.forgotPassword(email);
    if (result.data.success) {
      req.app.locals.forgotEmail = email;
      const otp = this._GenerateOtp.createOtp();

      req.app.locals.forgotOtp = otp;
      setTimeout(() => {
        req.app.locals.forgotOtp = this._GenerateOtp.createOtp();
      }, 2 * 60000);

      this._GenerateEmail.sendEmail(email, otp);
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

    const result = await this._TrainerUseCase.updatePassword(
      forgotEmail,
      password
    );

    if (result) {
      req.app.locals.otp = null;
      req.app.locals.forgotEmail = null;
      res.status(result.status).json(result.data);
    }
  });

  resendForgotOtp = asyncErrorHandler(async (req: Request, res: Response) => {
    const otp = this._GenerateOtp.createOtp();
    req.app.locals.forgotOtp = otp;
    setTimeout(() => {
      req.app.locals.forgotOtp = this._GenerateOtp.createOtp();
    }, 2 * 60000);

    this._GenerateEmail.sendEmail(req.app.locals.forgotEmail, otp);

    res.status(200).json({ message: "Otp sent successfully" });
  });

  getUserDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const userData = await this._TrainerUseCase.getUserDetails(userId);

    res.status(userData.status).json(userData.data);
  });

  getSubscriptions = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainerId = req.trainerId || "";
    const subscriptions = await this._TrainerUseCase.getSubscriptions(trainerId);
    res.status(subscriptions.status).json(subscriptions.data);
  });

  getTrainerData = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainerId = req.trainerId || "";
    const trainerData = await this._TrainerUseCase.getTrainerData(trainerId);
    res.status(trainerData.status).json(trainerData.data);
  });

  editProfile = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainerId = req.trainerId || "";
    const trainerData = await this._TrainerUseCase.editProfile(
      trainerId,
      req.body,
      req.file
    );
    res.status(trainerData.status).json(trainerData.data);
  });

  getDashboardData = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainerId = req.trainerId || "";
    const dashboardData = await this._TrainerUseCase.getDashboardData(trainerId);
    res.status(dashboardData.status).json(dashboardData.data);
  });

  setTrainerBrowserToken = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.trainerId || "";
    const browserToken = req.body.token;
    const response = await this._TrainerUseCase.setBrowserToken(
      userId as string,
      browserToken as string
    );
    res.status(response.status).json(response.data);
  });
}

export default TrainerController;
