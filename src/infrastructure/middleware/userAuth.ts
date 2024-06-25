import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../repository/userRepository";
import JWTToken from "../services/generateToken";
const _jwtToken = new JWTToken();

const _userRepo = new UserRepository();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const userToken = req.cookies.user_access_token;
  const userRefreshToken = req.cookies.user_refresh_token;
  if (!userRefreshToken) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
  if (!userToken) {
    const newUserToken = await refreshAccessToken(userRefreshToken);
    res.cookie("user_access_token", newUserToken, {
      maxAge: 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development",
    });
  }

  if (userToken) {
    try {
      const decodedData = jwt.verify(
        userToken,
        process.env.JWT_SECRET_KEY as string
      ) as JwtPayload;

      const user = await _userRepo.findById(decodedData.userId as string);
      if (decodedData && (!decodedData.role || decodedData.role !== "user")) {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }

      if (user) {
        if (user.isBlocked) {
          return res.status(401).json({ message: "You are blocked by admin!" });
        } else {
          req.userId = decodedData.userId;
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

const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");
    const decoded = _jwtToken.verifyRefreshToken(refreshToken);
    const newAccessToken = _jwtToken.generateToken(decoded?.userId, "user");
    return newAccessToken;
  } catch (error) {
    
    throw new Error("Invalid refresh token");
  }
};

export { protect };
