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
  console.log('in protect middleware')
  let token;

  const authHeader = req.headers.authorization;

  console.log('authHeader',authHeader)

  if (!authHeader) {
    return res.status(401).send("Authorization header is missing");
  }

  const tokens = authHeader.split(",").map((token) => token.trim());

  if (tokens.length === 2) {
    token = tokens[0].split(" ")[1];
  } else {
    token = tokens[0].split(" ")[1];
  }

  console.log('token',token)

  if (token) {
    try {
      const decodedData = jwt.verify(
        token,
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
