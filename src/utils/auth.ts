import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserDoc } from "../../lib/schemas";

declare global {
  namespace Express {
    interface Request {
      user: IUserDoc | JwtPayload | string | any;
    }
  }
}

export const verifyToken = (permission?: string) =>
  (async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;

      req.user = decoded.user as JwtPayload;

      return next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }) as RequestHandler;
