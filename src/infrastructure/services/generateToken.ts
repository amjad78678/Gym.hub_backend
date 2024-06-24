import jwt, { JwtPayload } from "jsonwebtoken";
import JWT from "../../useCase/interface/jwt";

class JWTToken implements JWT {
  generateToken(userId: string, role: string): string {
    const SECRETKEY = process.env.JWT_SECRET_KEY;

    if (SECRETKEY) {
      const token: string = jwt.sign({ userId, role }, SECRETKEY, {
        expiresIn: "1h",
      });
      return token;
    }

    throw new Error("JWT key is not defined!");
  }
  generateRefreshToken(userId: string, role: string): string {
    const SECRETKEY = process.env.JWT_REFRESH_SECRET;

    if (SECRETKEY) {
      const token: string = jwt.sign({ userId, role }, SECRETKEY, {
        expiresIn: "30d",
      });
      return token;
    }

    throw new Error("JWT key is not defined!");
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      let secret = process.env.JWT_SECRET_KEY;
      if (secret) {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return { success: true, decoded };
      }
      throw new Error("JWT key is not defined!");
    } catch (err: any) {
      console.error("Error while verifying JWT token:", err);
      if (err?.name === "TokenExpiredError") {
        return { success: false, message: "Token Expired!" };
      } else {
        return { success: false, message: "Internal server error" };
      }
    }
  }
  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      let secret = process.env.JWT_REFRESH_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return { success: true, decoded };
      }
      throw new Error("JWT key is not defined!");
    } catch (err: any) {
      console.error("Error while verifying JWT token:", err);
      if (err?.name === "TokenExpiredError") {
        return { success: false, message: "Token Expired!" };
      } else {
        return { success: false, message: "Internal server error" };
      }
    }
  }
}

export default JWTToken;
