import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../repository/userRepository";
import JWTToken from "../services/generateToken";
import { decode } from "punycode";
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
  let userToken = req.cookies.user_access_token;
  const userRefreshToken = req.cookies.user_refresh_token;

  if (!userRefreshToken) {
    return res
      .status(401)
      .json({ message: "Not authorized, no refresh token" });
  }

  if (!userToken) {
    try {
      const newUserToken = await refreshAccessToken(userRefreshToken);
      res.cookie("user_access_token", newUserToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development",
      });
      userToken = newUserToken;
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Failed to refresh access token" });
    }
  }

  try {
    const decodedData = _jwtToken.verifyToken(userToken);

    if (!decodedData?.success) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await _userRepo.findById(decodedData.decoded.userId as string);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(401).json({ message: "You are blocked by admin!" });
    }

    if (!decodedData.decoded.role || decodedData.decoded.role !== "user") {
      return res.status(401).json({ message: "Not authorized, invalid role" });
    }

    req.userId = decodedData.decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");
    const decoded = _jwtToken.verifyRefreshToken(refreshToken);
    const newAccessToken = _jwtToken.generateToken(
      decoded?.decoded.userId,
      "user"
    );
    return newAccessToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export { protect };
