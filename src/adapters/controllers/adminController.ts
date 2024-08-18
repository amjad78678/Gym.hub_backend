import AdminUseCase from "../../useCase/adminUseCase";
import { Request, Response } from "express";
import asyncErrorHandler from "../../infrastructure/utils/asyncErrorHandler";

class AdminController {
  private _AdminUseCase: AdminUseCase;

  constructor(adminUseCase: AdminUseCase) {
    this._AdminUseCase = adminUseCase;
  }

  getGymDetails = asyncErrorHandler(async (req: Request, res: Response) => {
    const gym = await this._AdminUseCase.getGymDetails();
    res.status(gym.status).json(gym.data);
  });

  gymAdminResponse = asyncErrorHandler(async (req: Request, res: Response) => {
    const gym = await this._AdminUseCase.gymAdminResponse(req.body);
    res.status(gym.status).json(gym.data);
  });

  gymBlockAction = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const gym = await this._AdminUseCase.gymBlockAction(id);
    res.status(gym.status).json(gym.data);
  });

  deleteGym = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const gym = await this._AdminUseCase.gymDeleteAction(id);
    res.status(gym.status).json(gym.data);
  });

  adminLogin = asyncErrorHandler(async (req: Request, res: Response) => {
    const response = await this._AdminUseCase.adminLogin(
      req.body.email,
      req.body.password
    );

    if (response.data.token) {
      res.cookie("adminJWT", response.data.token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    res.status(response.status).json(response.data);
  });

  adminLogout = asyncErrorHandler(async (req: Request, res: Response) => {
    res.cookie("adminJWT", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Admin logged out" });
  });

  fetchUsers = asyncErrorHandler(async (req: Request, res: Response) => {
    const response = await this._AdminUseCase.fetchUsers();
    res.status(response.status).json(response.data);
  });

  updateUser = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const { isBlocked, isDeleted } = req.body;
    const response = await this._AdminUseCase.updateUser(userId, isBlocked, isDeleted);
    res.status(response.status).json(response.data);
  });

  fetchSubscriptions = asyncErrorHandler(async (req: Request, res: Response) => {
    const subscriptionData = await this._AdminUseCase.fetchSubscriptions();
    res.status(subscriptionData.status).json(subscriptionData.data);
  });

  fetchGymWithId = asyncErrorHandler(async (req: Request, res: Response) => {
    const gymData = await this._AdminUseCase.fetchGymWithId(req.params.gymId);
    res.status(gymData.status).json(gymData.data);
  });

  getTrainers = asyncErrorHandler(async (req: Request, res: Response) => {
    const trainersData = await this._AdminUseCase.fetchTrainers();
    res.status(trainersData.status).json(trainersData.data);
  });

  updateTrainer = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id, ...body } = req.body;
    const response = await this._AdminUseCase.updateTrainer(id, body);
    res.status(response.status).json(response.data);
  });

  fetchRecentlyUsers = asyncErrorHandler(async (req: Request, res: Response) => {
    const response = await this._AdminUseCase.fetchRecentlyUsers();
    res.status(response.status).json(response.data);
  });
}

export default AdminController;

