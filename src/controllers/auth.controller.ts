import { Request, Response, NextFunction } from "express";
import { signUp, login, getUserDetailsByToken } from "../services/auth.service";
import logger from "../utils/logger";

const signUpController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const requestBody = { name: req.body.name, email: req.body.email, password: req.body.password, role: req.body.role };
        await signUp(requestBody);
        logger.info('Auth Controller: signUp successfully');
        res.status(201).json({ status: true, message: "User registered successfully." });
    } catch (error) {
        logger.error('Auth Controller signUp service Failed: ', error);
        next(error); //Send the error to global error handler middleware;;;
    }
};

const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const credentials = { email: req.body.email, password: req.body.password };
        let result = await login(credentials);
        logger.info('Auth Controller: login successfully.');
        res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
        logger.error('Auth Controller-login Failed : ', error);
        next(error); //Send the error to global error handler middleware;;;
    }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userToken = req.headers.authorization as string;
        const user = await getUserDetailsByToken(userToken);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        logger.error('Auth Controller Failed: ', error);
        next(error); //Send the error to global error handler middleware;;;
    }
};

export { signUpController, loginController, getMyProfile }