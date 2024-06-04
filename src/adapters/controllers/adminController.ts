import AdminUseCase from "../../useCase/adminUseCase";
import { Request, Response } from "express";

class AdminController {
  private _AdminUseCase: AdminUseCase;

  constructor(adminUseCase: AdminUseCase) {
    this._AdminUseCase = adminUseCase;
  }

  async getGymDetails(req: Request, res: Response) {
    try {
      const gym = await this._AdminUseCase.getGymDetails();
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

  async gymAdminResponse(req: Request, res: Response) {
    try {
      const gym = await this._AdminUseCase.gymAdminResponse(req.body);
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

  async gymBlockAction(req: Request, res: Response) {
    try {
      const { id } = req.params;

      console.log("iam id", id, "params", req.params);

      const gym = await this._AdminUseCase.gymBlockAction(id);
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

  async deleteGym(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gym = await this._AdminUseCase.gymDeleteAction(id);

      console.log("controller", gym);
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

  async adminLogin(req: Request, res: Response) {
    try {
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
    } catch (error) {
      const err: Error = error as Error;

      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async adminLogout(req: Request, res: Response) {
    try {
      res.cookie("adminJWT", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      res.status(200).json({ message: "Admin logged out" });
    } catch (error) {
      const err: Error = error as Error;

      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async fetchUsers(req: Request, res: Response) {
    try {
      const response = await this._AdminUseCase.fetchUsers();
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;

      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      console.log("iam stack", err.stack, "---", "iam message", err.message);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id as string;

      console.log("iamuserId", userId);
      console.log("iam body", req.body);

      const { isBlocked, isDeleted } = req.body;

      const response = await this._AdminUseCase.updateUser(
        userId,
        isBlocked,
        isDeleted
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

  async fetchSubscriptions(req: Request, res: Response) {
    try {
      const subscriptionData = await this._AdminUseCase.fetchSubscriptions();
      res.status(subscriptionData.status).json(subscriptionData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async fetchGymWithId(req: Request, res: Response) {
    try {
      const gymData = await this._AdminUseCase.fetchGymWithId(req.params.gymId);
      console.log(gymData);
      res.status(gymData.status).json(gymData.data);
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
      const trainersData = await this._AdminUseCase.fetchTrainers();
      res.status(trainersData.status).json(trainersData.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async updateTrainer(req: Request, res: Response) {
    try {
      const {id,...body}=req.body
      console.log('iam excluded body',body)
      const response = await this._AdminUseCase.updateTrainer(id,body);
      res.status(response.status).json(response.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    }
  }

  async fetchRecentlyUsers(req: Request, res: Response) {
    try {
      const response = await this._AdminUseCase.fetchRecentlyUsers();
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

export default AdminController;
