import { Router } from 'express';
import {
    createTaskController, getAllTasksController, getTaskByIdController,
    updateController, deleteController, commentOnTaskController,
    getAllCommentsTaskController
} from '../controllers/task.controller';
import validateRequest from '../middlewares/validate.request';
import authMiddleware from '../middlewares/auth.middleware';
import createTaskSchema from '../validators/task.body.schema';
import commentSchema from '../validators/comment.schema';
import { taskSchema, paginationSchema, deleteSchema } from '../validators/query.schema';
const router = Router();

router.post('/', authMiddleware, validateRequest({ body: createTaskSchema }), createTaskController);
router.get('/', authMiddleware, validateRequest({ query: paginationSchema }), getAllTasksController);
router.get('/:id', authMiddleware, validateRequest({ params: taskSchema }), getTaskByIdController);
router.patch('/:id', authMiddleware, validateRequest({ params: taskSchema, body: createTaskSchema }), updateController);
router.delete('/:id', authMiddleware, validateRequest({ params: taskSchema, query: deleteSchema }), deleteController);
router.post('/:id/comments', authMiddleware, validateRequest({ params: taskSchema, body: commentSchema }), commentOnTaskController);
router.get('/:id/comments', authMiddleware, validateRequest({ params: taskSchema, query: paginationSchema }), getAllCommentsTaskController);

export default router;