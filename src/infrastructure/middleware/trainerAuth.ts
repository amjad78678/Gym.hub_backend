import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import TrainerRepository from "../repository/trainerRepository";
const _TrainerRepository = new TrainerRepository();

declare global {
  namespace Express {
    interface Request {
      trainerId?: string;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const trainerToken = req.headers.authorization?.split(" ")[1];

  if (!trainerToken) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }

  if (trainerToken) {
    try {
      const decodedData = jwt.verify(
        trainerToken,
        process.env.JWT_SECRET_KEY as string
      ) as JwtPayload;

      const trainer = await _TrainerRepository.findByIdTrainer(
        decodedData.userId as string
      );

      if (
        decodedData &&
        (!decodedData.role || decodedData.role !== "trainer")
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }

      if (trainer) {
        if (trainer.isBlocked) {
          return res
            .status(401)
            .json({ message: "Gym have been blocked by admin!" });
        } else {
          req.trainerId = decodedData.userId;

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
