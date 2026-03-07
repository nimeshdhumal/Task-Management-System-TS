import { Router } from 'express';
import { getSingleCommentController, updateCommentController, deleteCommentController } from '../controllers/comment.controller';
import validateRequest from '../middlewares/validate.request';
import authMiddleware from '../middlewares/auth.middleware';
import commentSchema from '../validators/comment.schema';
import { taskSchema, deleteSchema } from '../validators/query.schema';

const router = Router();

router.get('/:id', authMiddleware, validateRequest({ params: taskSchema }), getSingleCommentController);
router.patch('/:id', authMiddleware, validateRequest({ params: taskSchema, body: commentSchema }), updateCommentController);
router.delete('/:id', authMiddleware, validateRequest({ params: taskSchema, query: deleteSchema }), deleteCommentController);

export default router;