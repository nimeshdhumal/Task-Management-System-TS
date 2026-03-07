import { Router } from 'express';
import { getAllTasksAdminController, deleteTasksAdminController, deleteCommentAdminController } from '../controllers/admin.controller';
import validateRequest from '../middlewares/validate.request';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { taskSchema, paginationSchema, deleteSchema } from '../validators/query.schema';

const router = Router();

router.get('/tasks', authMiddleware, roleMiddleware, validateRequest({ query: paginationSchema }), getAllTasksAdminController);
router.delete('/tasks/:id', authMiddleware, roleMiddleware, validateRequest({ params: taskSchema, query: deleteSchema }), deleteTasksAdminController);
router.delete('/comments/:id', authMiddleware, roleMiddleware, validateRequest({ params: taskSchema, query: deleteSchema }), deleteCommentAdminController);

export default router;