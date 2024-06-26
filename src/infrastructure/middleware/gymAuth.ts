import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import GymRepository from "../repository/gymRepository";

const _gymRepo = new GymRepository();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      gymId?: string;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const gymToken = req.headers.authorization?.split(" ")[1];
  
  if (!gymToken) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }

  if (gymToken) {
    try {
      const decodedData = jwt.verify(
        gymToken,
        process.env.JWT_SECRET_KEY as string
      ) as JwtPayload;

      const gym = await _gymRepo.findById(decodedData.userId as string);

      if (decodedData && (!decodedData.role || decodedData.role !== "gym")) {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }

      if (gym) {
        if (gym.isBlocked) {
          return res
            .status(401)
            .json({ message: "Gym have been blocked by admin!" });
        } else {
          req.gymId = decodedData.userId;
          next();
        }
      }
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

export { protect };
