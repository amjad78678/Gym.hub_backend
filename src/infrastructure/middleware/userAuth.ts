import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../repository/userRepository";

const _userRepo = new UserRepository();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {

  const userToken = req.headers.authorization?.split(" ")[1];

  console.log('authHeader',userToken)

  if (!userToken) {
    return res.status(401).send("Authorization header is missing");
  }




  console.log('token',userToken)

  if (userToken) {
    try {
      const decodedData = jwt.verify(
        userToken,
        process.env.JWT_SECRET_KEY as string
      ) as JwtPayload;

      console.log('decodedData',decodedData)

      const user = await _userRepo.findById(decodedData.userId as string);

      if (decodedData && (!decodedData.role || decodedData.role !== "user")) {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }

      if (user) {
        req.userId = user._id;
        if (user.isBlocked) {
          return res.status(401).json({ message: "You are blocked by admin!" });
        } else {
          next();
        }
      } else {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export { protect };
