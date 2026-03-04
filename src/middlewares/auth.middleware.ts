import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/app.error";
import logger from "../utils/logger";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    logger.info("Auth Middleware section started.");

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
      throw new AppError("Authorization is required", 401);

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      id: number;
      email: string;
      role: "admin" | "user";
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    logger.info("Auth Middleware section passed successfully!");
    next();
  } catch (error) {
    logger.error("Auth Middleware Failed: ", error);
    next(error);
  }
};

export default authMiddleware;
