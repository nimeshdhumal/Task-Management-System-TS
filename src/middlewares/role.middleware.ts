import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const roleChecking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info("Admin role checking section started.");
    if (req.user.role !== "admin") {
      logger.error("Admin section: Access denied");
      res.status(401).json({ status: false, message: "Access Denied" });
    } else {
      logger.info("Admin section: Your are admin.");
      next();
    }
  } catch (error) {
    logger.error("Role Checking Middleware Failed: ", error);
    next(error);
  }
};

export default roleChecking;
