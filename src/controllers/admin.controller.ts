import { Request, Response, NextFunction } from 'express';
import { getAllTasks, deleteTask } from '../services/task.service';
import { deleteComment } from '../services/comment.service';
import buildActor from '../utils/actor.util';
import logger from '../utils/logger';

const getAllTasksAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const result = await getAllTasks({
            page: actor.page,
            limit: actor.limit,
            sort: actor.sort,
            order: actor.order,
            userId: actor.userId,
            includeDeleted: true,
            status: actor.status,
            search: actor.search
        });
        logger.info('Admin Controller: getAllTasksAdminController call.');
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        logger.error('Admin Controller getAllTasks Failed: ', error);
        next(error);
    }
};

const deleteTasksAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        await deleteTask(actor.id, actor.force, actor.userId);
        logger.info('Admin Controller: deleteTasksAdminController call.');
        res.status(200).json({ success: true, data: "Task deleted" });
    } catch (error) {
        logger.error('Admin Controller deleteTasksAdminController Failed: ', error);
        next(error);
    }
};

const deleteCommentAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        await deleteComment(actor.id, actor.userId, actor.force);
        logger.info('Admin Controller: deleteCommentAdminController call.');
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        logger.error('Admin Controller deleteCommentAdminController Failed: ', error);
        next(error);
    }
};

export { getAllTasksAdminController, deleteTasksAdminController, deleteCommentAdminController }