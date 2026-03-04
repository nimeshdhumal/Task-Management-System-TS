import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { ISignUpInput, ILoginInput, IUserPublic } from "../types";
import { User } from "../models";
import AppError from "../utils/app.error";
import logger from "../utils/logger";

const signUp = async (data: ISignUpInput): Promise<void> => {
  try {
    const isEmailExists = await User.findOne({
      attributes: ["email"],
      where: { email: data.email },
    });

    if (isEmailExists) throw new AppError("User already exists", 409); //Checking if email exists or not;;;

    const hashedPassword = await bcrypt.hash(data.password, 10);//Convert the plain password into the Hash Code;;;
    await User.create({ ...data, password: hashedPassword });//save data into DB;;;
    logger.info('Auth Service: signUp successful');
  } catch (error) {
    logger.error('Auth Service signUp Failed: ', error);
    throw error;
  }
};

const login = async (data: ILoginInput): Promise<{ token: string; user: IUserPublic }> => {
  try {

    const existingUser = await User.findOne({ where: { email: data.email } });//Checking user is exists or not;;;
    if (!existingUser) throw new AppError('User not found', 404);//Throw a error if user not exists;;;

    const isPasswordMatch = await bcrypt.compare(data.password, existingUser.password);//checking the password;;;
    if (!isPasswordMatch) throw new AppError('Invalid password', 401);

    const { id, name, email, role, createdAt, updatedAt } = existingUser;
    const userPublic: IUserPublic = { id, name, email, role, createdAt, updatedAt };

    const secretKey = process.env.JWT_SECRET_KEY ?? 'NothingToSay';
    const jwtExpire = (process.env.JWT_EXPIRES ?? '7d') as SignOptions['expiresIn'];

    if (!secretKey) throw new AppError('JWT secret key is not configured', 500);

    const payload = userPublic;
    const token = jwt.sign(payload, secretKey, { expiresIn: jwtExpire });//Generate the token;;;

    logger.info('Auth Service: login successful');
    return { token, user: userPublic };

  } catch (error) {
    logger.error('Auth Service Login Failed: ', error);
    throw error;
  }
};

const getUserDetailsByToken = async (usertoken: string): Promise<IUserPublic> => {

  try {
    const token = usertoken.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) throw new AppError('JWT secret key is not configured', 500);

    const decodedToken = jwt.verify(token, secretKey) as IUserPublic;
    const userDetails = await User.findOne({ where: { email: decodedToken.email } });

    if (userDetails == null) throw new AppError('User not found', 404);

    logger.info('Auth Service: getUserDetailsByToken successful');

    const { id, name, email, role, createdAt, updatedAt } = userDetails;
    return { id, name, email, role, createdAt, updatedAt };

  } catch (error) {
    logger.error('Auth Service getUserDetailsByToken Failed: ', error);
    throw error;
  }

};

const getUserDetailsByEmailId = async (email: string): Promise<IUserPublic> => {

  try {
    const userDetails = await User.findOne({ where: { email } });
    if (!userDetails) throw new AppError('User not found', 404);

    const { id, name, email: userEmail, role, createdAt, updatedAt } = userDetails as IUserPublic;

    logger.info('Auth Service getUserDetailsByEmailId: ');

    return { id, name, email: userEmail, role, createdAt, updatedAt };
  }
  catch (error) {
    logger.error('Auth Service getUserDetailsByEmailId Failed: ', error);
    throw error;
  }

};

export { signUp, login, getUserDetailsByToken, getUserDetailsByEmailId };

