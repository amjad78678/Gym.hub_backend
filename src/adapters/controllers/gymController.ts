import GenerateOtp from "../../infrastructure/services/generateOtp";
import GenerateEmail from "../../infrastructure/services/sendEmail";
import SharpImages from "../../infrastructure/services/sharpImages";
import CloudinaryUpload from "../../infrastructure/services/cloudinaryUpload";
import GymUseCase from "../../useCase/gymUseCase";
import { Request, Response } from "express";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

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

  gymRegister = asyncErrorHandler(async (req: Request, res: Response) => {
    const gym = await this._GymUseCase.gymSignUp(req.body);
    if (gym?.data.status === true) {
      req.app.locals.gymData = gym.data.gymData;
      const otp = this._GenerateOtp.createOtp();
      console.log(otp);
      req.app.locals.otp = otp;
      this._GenerateEmail.sendEmail(req.body.email, otp);

      setTimeout(() => {
        req.app.locals.otp = this._GenerateOtp.createOtp();
      }, 2 * 60000);

      res.status(gym.status).json(gym.data);
    } else {
      res.status(gym.status).json(gym.data);
    }
  });

  gymOtpVerification = asyncErrorHandler(
    async (req: Request, res: Response) => {
      if (req.body.otp === req.app.locals.otp) {
        const gym = await this._GymUseCase.gymOtpVerification(
          req.app.locals.gymData
        );
        if (gym.data.status === true) {
          req.app.locals.gymData = null;
          req.app.locals.otp = null;
          res.status(gym.status).json(gym.data);
        }
      } else {
        res.status(400).json({ status: false, message: "Invalid Otp" });
      }
    }
  );

  resendOtp = asyncErrorHandler(async (req: Request, res: Response) => {
    const otp = this._GenerateOtp.createOtp();
    console.log(otp);
    req.app.locals.otp = otp;
    this._GenerateEmail.sendEmail(req.app.locals.gymData.email, otp);

    setTimeout(() => {
      req.app.locals.otp = this._GenerateOtp.createOtp();
    }, 2 * 60000);

    res.status(200).json({ message: "Otp sent successfully" });
  });

  gymLogin = asyncErrorHandler(async (req: Request, res: Response) => {
    const gym = await this._GymUseCase.gymLogin(req.body);
    if (gym && gym?.data.token !== "") {
      res.cookie("gymJWT", gym.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(gym.status).json(gym.data);
    }
  });

  logout = asyncErrorHandler(async (req: Request, res: Response) => {
    res.cookie("gymJWT", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  });

  editGymSubscription = asyncErrorHandler(
    async (req: Request, res: Response) => {
      const gymId = req.gymId || "";
      const gym = await this._GymUseCase.editGymSubscription(gymId, req.body);
      res.status(gym.status).json(gym.data);
    }
  );

  fetchGymSubscription = asyncErrorHandler(
    async (req: Request, res: Response) => {
      const gymId = req.gymId || "";
      const subscriptions = await this._GymUseCase.fetchGymSubscription(gymId);
      res.status(subscriptions.status).json(subscriptions.data.message);
    }
  );

  forgotPassword = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await this._GymUseCase.forgotPassword(email);
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
    const result = await this._GymUseCase.updatePassword(forgotEmail, password);

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

  fetchGymTrainers = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const trainers = await this._GymUseCase.fetchGymTrainers(gymId);
    res.status(trainers.status).json(trainers.data);
  });

  addGymTrainer = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    if (req.file) {
      const image = await this._SharpImages.sharpenImage(
        req.file,
        1500,
        1126,
        "trainers"
      );
      const trainerData = {
        ...req.body,
        image: { imageUrl: image.secure_url, public_id: image.public_id },
      };
      const response = await this._GymUseCase.addGymTrainer(gymId, trainerData);
      res.status(response.status).json(response.data);
    } else {
      const response = await this._GymUseCase.addGymTrainer(gymId, req.body);
      res.status(response.status).json(response.data);
    }
  });

  updateGymTrainer = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainerId = req.body._id;
    if (req.file) {
      const image = await this._SharpImages.sharpenImage(
        req.file,
        1500,
        1126,
        "trainers"
      );
      const trainerData = {
        ...req.body,
        image: { imageUrl: image.secure_url, public_id: image.public_id },
      };
      delete trainerData._id;
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
  });

  fetchGymData = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const response = await this._GymUseCase.fetchGymData(gymId);
    res.status(response.status).json(response.data);
  });

  bookedMemberships = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const response = await this._GymUseCase.bookedMemberships(gymId);
    res.status(response.status).json(response.data);
  });

  fetchDashboardDetails = asyncErrorHandler(
    async (req: Request, res: Response) => {
      const gymId = req.gymId || "";
      const response = await this._GymUseCase.fetchDashboardDetails(gymId);
      res.status(response.status).json(response.data);
    }
  );

  editGymProfile = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const response = await this._GymUseCase.editGymProfile(gymId, req.body);
    res.status(response.status).json(response.data);
  });

  editGymImages = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymId = req.gymId || "";
    const response = await this._GymUseCase.editGymImages(gymId, req.files);
    res.status(response.status).json(response.data);
  });
}

export default GymController;
