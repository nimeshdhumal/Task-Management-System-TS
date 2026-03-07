import { Router } from 'express';
import { signUpController, loginController, getMyProfile } from '../controllers/auth.controller';
import validateRequest from '../middlewares/validate.request';
import authMiddleware from '../middlewares/auth.middleware';
import { signUpSchema, loginSchema } from '../validators/auth.body.schema';
import commonHeaderSchema from '../validators/common.header.schema';
import authHeaderSchema from '../validators/auth.header.schema';
const router = Router();

router.post('/signup', validateRequest({ headers: commonHeaderSchema, body: signUpSchema }), signUpController);
router.post('/login', validateRequest({ headers: commonHeaderSchema, body: loginSchema }), loginController);
router.get('/me', validateRequest({ headers: authHeaderSchema }), authMiddleware, getMyProfile);

export default router;